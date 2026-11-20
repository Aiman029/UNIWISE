<?php

namespace App\Http\Controllers;

use App\Models\Programme;
use App\Models\Recommendation;
use App\Models\RiasecQuestion;
use App\Models\RiasecResponse;
use App\Models\SpmResult;
use App\Services\ImksCalculator;
use App\Services\MeritCalculator;
use App\Services\RiasecMatcher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class RiasecController extends Controller
{
    public const TRAIT_DESCRIPTIONS = [
        'Realistic' => [
            'name' => 'REALISTIK',
            'tagline' => 'Pelaksana Praktikal',
            'description' => 'Anda seorang yang praktikal, gemar aktiviti secara langsung, serta seronok bekerja dengan peralatan, mesin, mekanikal, dan tugasan fizikal. Anda menyerlah dalam penyelesaian masalah secara nyata dengan hasil yang konkrit.',
        ],
        'Investigative' => [
            'name' => 'INVESTIGATIF',
            'tagline' => 'Pemikir Analitikal',
            'description' => 'Anda seorang yang analitikal, ingin tahu, dan peka. Anda cemerlang dalam menyelesaikan masalah kompleks, menjalankan penyelidikan, menganalisis data, memahami cara sesuatu berfungsi, serta meneroka idea baharu.',
        ],
        'Artistic' => [
            'name' => 'ARTISTIK',
            'tagline' => 'Pencipta Kreatif',
            'description' => 'Anda seorang yang kreatif, ekspresif, dan asli. Anda menyerlah dalam persekitaran fleksibel yang menggalakkan imaginasi, reka bentuk visual, komunikasi, penulisan, dan ekspresi seni.',
        ],
        'Social' => [
            'name' => 'SOSIAL',
            'tagline' => 'Pembimbing & Pembantu',
            'description' => 'Anda seorang yang empati, bekerjasama, dan penyabar. Anda gemar mengajar, membimbing, membantu masyarakat, dan bekerja dalam pasukan untuk memberi impak sosial yang positif.',
        ],
        'Enterprising' => [
            'name' => 'ENTERPRISING',
            'tagline' => 'Pemimpin & Penggerak',
            'description' => 'Anda seorang yang yakin diri, bercita-cita tinggi, dan pandai memujuk. Anda gemar memimpin, menerajui inisiatif perniagaan, pengucapan awam, perundingan, serta menggerakkan pasukan mencapai matlamat.',
        ],
        'Conventional' => [
            'name' => 'KONVENSIONAL',
            'tagline' => 'Pengurus Sistematik',
            'description' => 'Anda seorang yang teliti, sistematik, dan teratur. Anda cemerlang menguruskan data berstruktur, rekod, pengiraan berangka, prosedur kerja, serta piawaian yang terperinci.',
        ],
    ];

    /**
     * Introduction / Landing view for RIASEC Assessment.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $hasSpm = SpmResult::where('user_id', $request->user()->id)->exists();
        if (! $hasSpm) {
            return redirect()->route('dashboard')->with('error', 'Sila lengkapkan Keputusan Akademik SPM terlebih dahulu.');
        }

        return Inertia::render('Riasec/Index');
    }

    /**
     * Take the 170-question IMKS 2013 (Holland RIASEC) quiz.
     */
    public function quiz(Request $request): Response|RedirectResponse
    {
        $hasSpm = SpmResult::where('user_id', $request->user()->id)->exists();
        if (! $hasSpm) {
            return redirect()->route('spm-results.index')->with('error', 'Sila lengkapkan Keputusan Akademik SPM terlebih dahulu.');
        }

        $questions = RiasecQuestion::orderByRaw('COALESCE(question_number, id) asc')
            ->orderBy('id')
            ->get();

        return Inertia::render('Riasec/Quiz', [
            'questions' => $questions,
        ]);
    }

    /**
     * Submit responses, compute IMKS/RIASEC scores, execute recommendation engine, save session snapshot.
     */
    public function submit(Request $request): RedirectResponse
    {
        $userId = $request->user()->id;

        $hasSpm = SpmResult::where('user_id', $userId)->exists();
        if (! $hasSpm) {
            return redirect()->route('spm-results.index')->with('error', 'Sila lengkapkan Keputusan Akademik SPM terlebih dahulu.');
        }

        $request->validate([
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:riasec_questions,id',
            'answers.*.value' => 'required|in:0,1,Y,T,y,t',
        ]);

        // Save responses
        RiasecResponse::where('user_id', $userId)->delete();
        $questions = RiasecQuestion::all()->keyBy('id');

        $legacyScores = [
            'Realistic' => 0,
            'Investigative' => 0,
            'Artistic' => 0,
            'Social' => 0,
            'Enterprising' => 0,
            'Conventional' => 0,
        ];

        foreach ($request->answers as $ans) {
            $qId = $ans['question_id'];
            $val = ImksCalculator::normalizeAnswerValue($ans['value']);
            $q = $questions->get($qId);

            if ($q) {
                RiasecResponse::create([
                    'user_id' => $userId,
                    'question_id' => $qId,
                    'answer_value' => $val,
                ]);

                if ($val === 1 && isset($legacyScores[$q->category])) {
                    $legacyScores[$q->category]++;
                }
            }
        }

        $isImks = $questions->contains(fn ($q) => !empty($q->cluster_code));
        $imksResult = null;

        if ($isImks) {
            $imksResult = ImksCalculator::calculateIMKSScore($request->answers, $questions);
            $scores = $imksResult['category_scores'];
            $matchingScores = $imksResult['exact_category_scores'];
        } else {
            $scores = $legacyScores;
            $matchingScores = $legacyScores;
        }

        // Determine ranked Holland traits & dominant trait (exact IMKS average tie-breaker, then R -> I -> A -> S -> E -> C)
        $rankedTraits = RiasecMatcher::rankTraits($matchingScores);
        $dominantTrait = $rankedTraits[0];

        // Calculate User SPM Merit Score & snapshot
        $spmRecords = SpmResult::where('user_id', $userId)->get();
        $meritScore = MeritCalculator::calculate($spmRecords->toArray());

        $spmSnapshot = $spmRecords->map(fn ($r) => [
            'subject' => $r->subject,
            'grade' => $r->grade,
        ])->toArray();

        // Multi-Trait RIASEC Matching (Top 2 / Top 3 Student Traits vs Programme 2-3 RIASEC Rules)
        $allProgrammes = Programme::with(['rules' => fn ($q) => $q->orderBy('id')])
            ->whereHas('rules')
            ->get();

        $uniqueProgrammes = RiasecMatcher::matchProgrammes($allProgrammes, $matchingScores, $spmSnapshot);

        // Create Recommendation session snapshot
        $sessionId = (string) Str::uuid();

        if ($uniqueProgrammes->isNotEmpty()) {
            foreach ($uniqueProgrammes as $prog) {
                Recommendation::create([
                    'user_id' => $userId,
                    'programme_id' => $prog->id,
                    'session_id' => $sessionId,
                    'merit_score' => $meritScore,
                    'dominant_trait' => $dominantTrait,
                    'riasec_scores' => $scores,
                    'imks_result' => $imksResult,
                    'spm_snapshot' => $spmSnapshot,
                    'date_generated' => now(),
                ]);
            }
        } elseif ($fallbackProgId = Programme::query()->value('id')) {
            Recommendation::create([
                'user_id' => $userId,
                'programme_id' => $fallbackProgId,
                'session_id' => $sessionId,
                'merit_score' => $meritScore,
                'dominant_trait' => $dominantTrait,
                'riasec_scores' => $scores,
                'imks_result' => $imksResult,
                'spm_snapshot' => $spmSnapshot,
                'date_generated' => now(),
            ]);
        }

        return redirect()->route('riasec.result', ['sessionId' => $sessionId]);
    }

    /**
     * Display RIASEC Assessment Result, dominant trait, radar graph, and recommended programmes list.
     */
    public function result(Request $request, string $sessionId): Response|RedirectResponse
    {
        $userId = $request->user()->id;

        $recs = Recommendation::with(['programme.rules' => fn ($q) => $q->orderBy('id')])
            ->where('user_id', $userId)
            ->where('session_id', $sessionId)
            ->orderBy('id')
            ->get();

        if ($recs->isEmpty()) {
            return redirect()->route('dashboard');
        }

        $first = $recs->first();
        $dominant = $first->dominant_trait;
        $scores = $first->riasec_scores ?? [];
        $imksResult = $first->imks_result ?? null;
        $meritScore = $first->merit_score ?? 0;

        $rankingScores = $imksResult['exact_category_scores'] ?? $scores;
        $topTraits = RiasecMatcher::getTopTraitSummaries($rankingScores, 3, $scores);
        $topTraitNames = array_column($topTraits, 'trait');

        $programmes = $recs->pluck('programme')
            ->filter()
            ->unique('id')
            ->map(fn (Programme $prog) => RiasecMatcher::enrichProgramme($prog, $topTraitNames))
            ->values();

        return Inertia::render('Riasec/Result', [
            'sessionId' => $sessionId,
            'dominantTrait' => $dominant,
            'topTraits' => $topTraits,
            'traitInfo' => self::TRAIT_DESCRIPTIONS[$dominant] ?? [
                'name' => strtoupper($dominant),
                'tagline' => 'Profil Personaliti',
                'description' => 'Dipadankan dengan program pengajian tinggi yang bersesuaian.',
            ],
            'riasecScores' => $scores,
            'imksResult' => $imksResult,
            'meritScore' => $meritScore,
            'programmes' => $programmes,
        ]);
    }

    /**
     * Display single programme details modal / view (Syarat Kemasukan).
     */
    public function programmeDetails(int $id): Response
    {
        $programme = RiasecMatcher::enrichProgramme(
            Programme::with(['rules' => fn ($q) => $q->orderBy('id')])->findOrFail($id)
        );

        return Inertia::render('Riasec/ProgrammeDetail', [
            'programme' => $programme,
        ]);
    }
}
