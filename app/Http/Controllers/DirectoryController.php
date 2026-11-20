<?php

namespace App\Http\Controllers;

use App\Models\Programme;
use App\Models\Recommendation;
use App\Models\SpmResult;
use App\Models\University;
use App\Services\MeritCalculator;
use App\Services\RiasecMatcher;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DirectoryController extends Controller
{
    /**
     * Display public/student course and university explorer directory.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $userMeritScore = null;
        $userTopTraits = [];

        if ($user) {
            $spmRecords = SpmResult::where('user_id', $user->id)->get();
            if ($spmRecords->isNotEmpty()) {
                $userMeritScore = MeritCalculator::calculate($spmRecords->toArray());
            }

            $latestRec = Recommendation::where('user_id', $user->id)
                ->whereNotNull('riasec_scores')
                ->orderBy('date_generated', 'desc')
                ->first();

            if ($latestRec && !empty($latestRec->riasec_scores)) {
                $rankingScores = $latestRec->imks_result['exact_category_scores'] ?? $latestRec->riasec_scores;
                $userTopTraits = RiasecMatcher::getTopTraitSummaries($rankingScores, 3, $latestRec->riasec_scores);
            }
        }

        $userTopTraitNames = array_column($userTopTraits, 'trait');

        // Fetch all programmes with ordered RIASEC rules (Primary + Sub)
        $programmes = Programme::with(['rules' => fn ($q) => $q->orderBy('id')])
            ->orderBy('institution')
            ->orderBy('name')
            ->get()
            ->map(fn (Programme $prog) => RiasecMatcher::enrichProgramme($prog, $userTopTraitNames));

        // Fetch all registered institutions
        $universities = University::orderBy('name')->get();

        // Compute directory summary stats
        $totalProgrammes = $programmes->count();
        $diplomaCount = $programmes->where('level', 'Diploma')->count();
        $foundationCount = $programmes->where('level', 'Foundation')->count();
        $certificateCount = $programmes->where('level', 'Certificate')->count();

        $stemCount = $programmes->filter(fn ($p) => $p->notes && stripos($p->notes, 'stem') !== false)->count();
        $tvetCount = $programmes->filter(fn ($p) => $p->notes && stripos($p->notes, 'tvet') !== false)->count();
        $interviewCount = $programmes->filter(fn ($p) => $p->notes && stripos($p->notes, 'temuduga') !== false)->count();

        return Inertia::render('Directory/Index', [
            'programmes' => $programmes,
            'universities' => $universities,
            'userMeritScore' => $userMeritScore,
            'userTopTraits' => $userTopTraits,
            'stats' => [
                'totalProgrammes' => $totalProgrammes,
                'totalUniversities' => $universities->count(),
                'diplomaCount' => $diplomaCount,
                'foundationCount' => $foundationCount,
                'certificateCount' => $certificateCount,
                'stemCount' => $stemCount,
                'tvetCount' => $tvetCount,
                'interviewCount' => $interviewCount,
            ],
        ]);
    }
}
