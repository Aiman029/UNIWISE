<?php

namespace App\Http\Controllers;

use App\Models\Recommendation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HistoryController extends Controller
{
    public function index(Request $request): Response
    {
        $userId = $request->user()->id;

        // Group past recommendations by session_id
        $sessions = Recommendation::where('user_id', $userId)
            ->whereNotNull('session_id')
            ->select('session_id', 'merit_score', 'dominant_trait', 'date_generated')
            ->groupBy('session_id', 'merit_score', 'dominant_trait', 'date_generated')
            ->orderBy('date_generated', 'desc')
            ->get();

        return Inertia::render('History/Index', [
            'history' => $sessions,
        ]);
    }

    public function show(Request $request, string $sessionId): Response
    {
        $userId = $request->user()->id;

        $recs = Recommendation::with('programme')
            ->where('user_id', $userId)
            ->where('session_id', $sessionId)
            ->get();

        abort_if($recs->isEmpty(), 404);

        $first = $recs->first();
        $dominant = $first->dominant_trait;
        $scores = $first->riasec_scores ?? [];
        $meritScore = $first->merit_score ?? 0;
        $spmResults = $first->spm_snapshot ?? [];
        $programmes = $recs->pluck('programme')->filter()->values();

        return Inertia::render('History/Show', [
            'sessionId' => $sessionId,
            'dateGenerated' => $first->date_generated?->format('d M Y, h:i A') ?? '',
            'meritScore' => $meritScore,
            'dominantTrait' => $dominant,
            'traitInfo' => RiasecController::TRAIT_DESCRIPTIONS[$dominant] ?? [
                'name' => strtoupper($dominant),
                'tagline' => 'Personality Profile',
                'description' => 'Historical assessment snapshot.',
            ],
            'riasecScores' => $scores,
            'spmResults' => $spmResults,
            'programmes' => $programmes,
        ]);
    }
}
