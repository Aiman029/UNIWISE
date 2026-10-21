<?php

namespace App\Http\Controllers;

use App\Models\Programme;
use App\Models\SpmResult;
use App\Models\University;
use App\Services\MeritCalculator;
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

        if ($user) {
            $spmRecords = SpmResult::where('user_id', $user->id)->get();
            if ($spmRecords->isNotEmpty()) {
                $userMeritScore = MeritCalculator::calculate($spmRecords->toArray());
            }
        }

        // Fetch all programmes
        $programmes = Programme::orderBy('institution')
            ->orderBy('name')
            ->get();

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
