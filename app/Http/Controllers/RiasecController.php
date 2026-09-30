<?php

namespace App\Http\Controllers;

use App\Models\Programme;
use App\Models\Recommendation;
use App\Models\RecommendationRule;
use App\Models\RiasecQuestion;
use App\Models\RiasecResponse;
use App\Models\SpmResult;
use App\Services\MeritCalculator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class RiasecController extends Controller
{
    public const TRAIT_DESCRIPTIONS = [
        'Realistic' => [
            'name' => 'REALISTIC',
            'tagline' => 'The Doers',
            'description' => 'You are practical, hands-on, and enjoy working with tools, machines, mechanics, and physical tasks. You thrive in practical problem-solving environments and concrete results.',
        ],
        'Investigative' => [
            'name' => 'INVESTIGATION',
            'tagline' => 'The Thinkers',
            'description' => 'You are analytical, curious, and observant. You excel at solving complex problems, conducting research, analyzing data, understanding how things work, and discovering new ideas.',
        ],
        'Artistic' => [
            'name' => 'ARTISTIC',
            'tagline' => 'The Creators',
            'description' => 'You are creative, expressive, and original. You thrive in flexible, unstructured environments that encourage imagination, visual design, communication, and creative expression.',
        ],
        'Social' => [
            'name' => 'SOCIAL',
            'tagline' => 'The Helpers',
            'description' => 'You are empathetic, cooperative, and patient. You enjoy teaching, guiding, caring for people, and working in teams to make a positive social impact.',
        ],
        'Enterprising' => [
            'name' => 'ENTERPRISING',
            'tagline' => 'The Persuaders',
            'description' => 'You are confident, ambitious, and persuasive. You enjoy leadership, business initiatives, public speaking, negotiation, and driving teams towards achieving goals.',
        ],
        'Conventional' => [
            'name' => 'CONVENTIONAL',
            'tagline' => 'The Organizers',
            'description' => 'You are detail-oriented, systematic, and organized. You excel in working with structured data, records, numerical calculations, procedures, and established guidelines.',
        ],
    ];

    /**
     * Introduction / Landing view for RIASEC Assessment.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $hasSpm = SpmResult::where('user_id', $request->user()->id)->exists();
        if (! $hasSpm) {
            return redirect()->route('dashboard')->with('error', 'Please complete Academic Results first');
        }

        return Inertia::render('Riasec/Index');
    }

    /**
     * Take the 30-question RIASEC quiz.
     */
    public function quiz(Request $request): Response|RedirectResponse
    {
        $hasSpm = SpmResult::where('user_id', $request->user()->id)->exists();
        if (! $hasSpm) {
            return redirect()->route('spm-results.index')->with('error', 'Please complete Academic Results first');
        }

        $questions = RiasecQuestion::orderBy('id')->get();

        return Inertia::render('Riasec/Quiz', [
            'questions' => $questions,
        ]);
    }

    /**
     * Submit responses, compute dominant trait, execute recommendation engine, save session snapshot.
     */
    public function submit(Request $request): RedirectResponse
    {
        $userId = $request->user()->id;

        $hasSpm = SpmResult::where('user_id', $userId)->exists();
        if (! $hasSpm) {
            return redirect()->route('spm-results.index')->with('error', 'Please complete Academic Results first');
        }

        $request->validate([
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:riasec_questions,id',
            'answers.*.value' => 'required|in:0,1',
        ]);

        // Save responses
        RiasecResponse::where('user_id', $userId)->delete();
        $questions = RiasecQuestion::all()->keyBy('id');

        $scores = [
            'Realistic' => 0,
            'Investigative' => 0,
            'Artistic' => 0,
            'Social' => 0,
            'Enterprising' => 0,
            'Conventional' => 0,
        ];

        foreach ($request->answers as $ans) {
            $qId = $ans['question_id'];
            $val = (int) $ans['value'];
            $q = $questions->get($qId);

            if ($q) {
                RiasecResponse::create([
                    'user_id' => $userId,
                    'question_id' => $qId,
                    'answer_value' => $val,
                ]);

                if ($val === 1 && isset($scores[$q->category])) {
                    $scores[$q->category]++;
                }
            }
        }

        // Determine dominant trait (with tie-breaking order R -> I -> A -> S -> E -> C)
        $dominantTrait = 'Realistic';
        $highestScore = -1;
        foreach (['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional'] as $trait) {
            if ($scores[$trait] > $highestScore) {
                $highestScore = $scores[$trait];
                $dominantTrait = $trait;
            }
        }

        // Calculate User SPM Merit Score & snapshot
        $spmRecords = SpmResult::where('user_id', $userId)->get();
        $meritScore = MeritCalculator::calculate($spmRecords->toArray());

        $spmSnapshot = $spmRecords->map(fn ($r) => [
            'subject' => $r->subject,
            'grade' => $r->grade,
        ])->toArray();

        // Rule-based Recommendation Matching:
        // Match recommendation rules where riasec_type == dominantTrait
        $rules = RecommendationRule::with('programme')
            ->where('riasec_type', $dominantTrait)
            ->get();

        // Filter matched programmes by checking min_grade against user's best/average grades
        $matchedProgrammes = [];
        foreach ($rules as $rule) {
            if ($rule->programme) {
                // Check if user's SPM results have any subject meeting or exceeding rule's min_grade
                // And merit score is reasonable
                $meetsCriteria = false;
                foreach ($spmSnapshot as $spmItem) {
                    if (MeritCalculator::meetsMinGrade($spmItem['grade'], $rule->min_grade)) {
                        $meetsCriteria = true;
                        break;
                    }
                }

                if ($meetsCriteria) {
                    $matchedProgrammes[] = $rule->programme;
                }
            }
        }

        // Fallback: If no direct rule matches with strict min_grade, retrieve default IPTA programmes for that RIASEC domain
        if (empty($matchedProgrammes)) {
            $fallbackRules = RecommendationRule::with('programme')
                ->where('riasec_type', $dominantTrait)
                ->take(5)
                ->get();
            foreach ($fallbackRules as $r) {
                if ($r->programme) {
                    $matchedProgrammes[] = $r->programme;
                }
            }
        }

        // Deduplicate programmes by ID
        $uniqueProgrammes = collect($matchedProgrammes)->unique('id')->values();

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
                    'spm_snapshot' => $spmSnapshot,
                    'date_generated' => now(),
                ]);
            }
        } else {
            // Even if none matched, record snapshot with null programme
            Recommendation::create([
                'user_id' => $userId,
                'programme_id' => 1,
                'session_id' => $sessionId,
                'merit_score' => $meritScore,
                'dominant_trait' => $dominantTrait,
                'riasec_scores' => $scores,
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

        $recs = Recommendation::with('programme')
            ->where('user_id', $userId)
            ->where('session_id', $sessionId)
            ->get();

        if ($recs->isEmpty()) {
            return redirect()->route('dashboard');
        }

        $first = $recs->first();
        $dominant = $first->dominant_trait;
        $scores = $first->riasec_scores ?? [];
        $meritScore = $first->merit_score ?? 0;
        $programmes = $recs->pluck('programme')->filter()->values();

        return Inertia::render('Riasec/Result', [
            'sessionId' => $sessionId,
            'dominantTrait' => $dominant,
            'traitInfo' => self::TRAIT_DESCRIPTIONS[$dominant] ?? [
                'name' => strtoupper($dominant),
                'tagline' => 'Personality Profile',
                'description' => 'Matched with higher education programmes.',
            ],
            'riasecScores' => $scores,
            'meritScore' => $meritScore,
            'programmes' => $programmes,
        ]);
    }

    /**
     * Display single programme details modal / view (Syarat Kemasukan).
     */
    public function programmeDetails(int $id): Response
    {
        $programme = Programme::findOrFail($id);

        return Inertia::render('Riasec/ProgrammeDetail', [
            'programme' => $programme,
        ]);
    }
}
