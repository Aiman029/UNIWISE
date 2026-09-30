<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Programme;
use App\Models\Recommendation;
use App\Models\RecommendationRule;
use App\Models\RiasecQuestion;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        // 4 Main Stat Cards per Figure 3.2.1.1.6
        $totalUsers = User::where('role', 'user')->count();
        $totalProgrammes = Programme::count();
        $totalQuestions = RiasecQuestion::count();
        $totalRules = RecommendationRule::count();

        // System Activity Feed
        // We aggregate recent activities from Users, Recommendations, and Programmes
        $activities = [];

        // Recent users
        $recentUsers = User::where('role', 'user')->orderBy('created_at', 'desc')->take(3)->get();
        foreach ($recentUsers as $u) {
            $activities[] = [
                'type' => 'user',
                'title' => 'New User Registered',
                'detail' => $u->name . ' (' . $u->email . ')',
                'time' => $u->created_at->diffForHumans(),
                'timestamp' => $u->created_at->timestamp,
            ];
        }

        // Recent recommendation matches
        $recentRecs = Recommendation::with('programme')->orderBy('date_generated', 'desc')->take(3)->get();
        foreach ($recentRecs as $rec) {
            $activities[] = [
                'type' => 'recommendation',
                'title' => 'Programme Matched by Merit',
                'detail' => ($rec->programme?->name ?? 'Programme') . ' (' . ($rec->merit_score ?? 0) . '%)',
                'time' => $rec->date_generated?->diffForHumans() ?? 'recently',
                'timestamp' => $rec->date_generated?->timestamp ?? now()->timestamp,
            ];
        }

        // Recent programmes
        $recentProgs = Programme::orderBy('created_at', 'desc')->take(2)->get();
        foreach ($recentProgs as $p) {
            $activities[] = [
                'type' => 'programme',
                'title' => 'IPTA Programme Added',
                'detail' => $p->name . ' - ' . $p->institution,
                'time' => $p->created_at ? $p->created_at->diffForHumans() : 'recently',
                'timestamp' => $p->created_at ? $p->created_at->timestamp : now()->timestamp,
            ];
        }

        // Sort combined activity by newest first
        usort($activities, fn ($a, $b) => $b['timestamp'] <=> $a['timestamp']);
        $activities = array_slice($activities, 0, 5);

        // Fallback default activities if system is brand new
        if (empty($activities)) {
            $activities = [
                ['type' => 'system', 'title' => 'System Seed Completed', 'detail' => 'Programmes and RIASEC questions initialized', 'time' => '1 hour ago'],
                ['type' => 'user', 'title' => 'Admin Account Initialized', 'detail' => 'admin@uniwise.com is active', 'time' => '2 hours ago'],
            ];
        }

        // Chart Data: Programme Type matched / distributed by Level (Diploma, Foundation, Certificate)
        $levelCounts = [
            'Diploma' => Programme::where('level', 'Diploma')->count(),
            'Foundation' => Programme::where('level', 'Foundation')->count(),
            'Certificate' => Programme::where('level', 'Certificate')->count(),
        ];

        // Recommendations breakdown by Programme Level
        $matchedByLevel = [
            'Diploma' => Recommendation::whereHas('programme', fn ($q) => $q->where('level', 'Diploma'))->count(),
            'Foundation' => Recommendation::whereHas('programme', fn ($q) => $q->where('level', 'Foundation'))->count(),
            'Certificate' => Recommendation::whereHas('programme', fn ($q) => $q->where('level', 'Certificate'))->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalProgrammes' => $totalProgrammes,
                'totalQuestions' => $totalQuestions,
                'totalRules' => $totalRules,
            ],
            'activities' => $activities,
            'chartData' => [
                'levels' => ['Diploma', 'Foundation', 'Certificate'],
                'available' => array_values($levelCounts),
                'matched' => array_values($matchedByLevel),
            ],
        ]);
    }
}
