<?php

namespace App\Http\Controllers;

use App\Models\Recommendation;
use App\Models\SpmResult;
use App\Services\MeritCalculator;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $userId = $request->user()->id;

        // Fetch SPM results
        $spmResults = SpmResult::where('user_id', $userId)->get();
        $hasSpm = $spmResults->isNotEmpty();
        $stream = $spmResults->first()?->stream ?? null;
        $meritScore = $hasSpm ? MeritCalculator::calculate($spmResults->toArray()) : null;

        // Fetch latest Recommendation Session
        $latestRec = Recommendation::where('user_id', $userId)
            ->whereNotNull('session_id')
            ->orderBy('date_generated', 'desc')
            ->first();

        $dominantTrait = $latestRec?->dominant_trait;
        $riasecScores = $latestRec?->riasec_scores;

        // Recent history entries (up to 3)
        $recentHistory = Recommendation::where('user_id', $userId)
            ->whereNotNull('session_id')
            ->select('session_id', 'merit_score', 'dominant_trait', 'date_generated')
            ->groupBy('session_id', 'merit_score', 'dominant_trait', 'date_generated')
            ->orderBy('date_generated', 'desc')
            ->take(3)
            ->get();

        return Inertia::render('Dashboard', [
            'hasSpm' => $hasSpm,
            'stream' => $stream,
            'meritScore' => $meritScore,
            'spmCount' => $spmResults->count(),
            'dominantTrait' => $dominantTrait,
            'riasecScores' => $riasecScores,
            'recentHistory' => $recentHistory,
        ]);
    }
}
