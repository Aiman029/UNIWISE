<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Programme;
use App\Models\Recommendation;
use App\Models\RecommendationRule;
use App\Models\RiasecQuestion;
use App\Models\SpmResult;
use App\Models\University;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        // 1. Core Summary Stats
        $totalUsers = User::where('role', 'user')->count();
        $totalProgrammes = Programme::count();
        $totalQuestions = RiasecQuestion::count();
        $totalRules = RecommendationRule::count();
        $totalUniversities = University::count();

        // 2. Fetch unique assessment sessions
        $sessions = Recommendation::selectRaw('session_id, user_id, dominant_trait, MAX(merit_score) as merit_score, MAX(date_generated) as date_generated')
            ->groupBy('session_id', 'user_id', 'dominant_trait')
            ->get();

        $totalAssessments = $sessions->count();
        $avgMerit = $totalAssessments > 0 ? round($sessions->avg('merit_score'), 1) : 0;
        $maxMerit = $totalAssessments > 0 ? round($sessions->max('merit_score'), 1) : 0;
        $minMerit = $totalAssessments > 0 ? round($sessions->min('merit_score'), 1) : 0;

        // 3. RIASEC Dominant Trait Distribution
        $traitMeta = [
            'Realistic' => ['code' => 'R', 'label' => 'Realistik', 'color' => '#f97316', 'bg' => 'bg-orange-500', 'text' => 'text-orange-600'],
            'Investigative' => ['code' => 'I', 'label' => 'Investigatif', 'color' => '#0284c7', 'bg' => 'bg-sky-600', 'text' => 'text-sky-600'],
            'Artistic' => ['code' => 'A', 'label' => 'Artistik', 'color' => '#8b5cf6', 'bg' => 'bg-purple-600', 'text' => 'text-purple-600'],
            'Social' => ['code' => 'S', 'label' => 'Sosial', 'color' => '#10b981', 'bg' => 'bg-emerald-600', 'text' => 'text-emerald-600'],
            'Enterprising' => ['code' => 'E', 'label' => 'Perniagaan', 'color' => '#f59e0b', 'bg' => 'bg-amber-500', 'text' => 'text-amber-600'],
            'Conventional' => ['code' => 'C', 'label' => 'Konvensional', 'color' => '#64748b', 'bg' => 'bg-slate-600', 'text' => 'text-slate-600'],
        ];

        $riasecDistribution = [];
        foreach ($traitMeta as $traitKey => $meta) {
            $count = $sessions->where('dominant_trait', $traitKey)->count();
            $percentage = $totalAssessments > 0 ? round(($count / $totalAssessments) * 100, 1) : 0;
            $riasecDistribution[] = [
                'trait' => $traitKey,
                'label' => $meta['label'],
                'code' => $meta['code'],
                'count' => $count,
                'percentage' => $percentage,
                'color' => $meta['color'],
                'bg' => $meta['bg'],
                'text' => $meta['text'],
            ];
        }

        // 4. Merit Score Distribution (5 Tiers)
        $meritTiers = [
            ['label' => '90% - 100%', 'grade' => 'Cemerlang', 'color' => 'bg-emerald-500', 'count' => 0],
            ['label' => '80% - 89.9%', 'grade' => 'Sangat Baik', 'color' => 'bg-sky-500', 'count' => 0],
            ['label' => '70% - 79.9%', 'grade' => 'Kepujian', 'color' => 'bg-indigo-500', 'count' => 0],
            ['label' => '60% - 69.9%', 'grade' => 'Lulus Baik', 'color' => 'bg-amber-500', 'count' => 0],
            ['label' => '< 60.0%', 'grade' => 'Asas', 'color' => 'bg-rose-400', 'count' => 0],
        ];

        foreach ($sessions as $s) {
            $m = (float) $s->merit_score;
            if ($m >= 90) $meritTiers[0]['count']++;
            elseif ($m >= 80) $meritTiers[1]['count']++;
            elseif ($m >= 70) $meritTiers[2]['count']++;
            elseif ($m >= 60) $meritTiers[3]['count']++;
            else $meritTiers[4]['count']++;
        }

        foreach ($meritTiers as &$tier) {
            $tier['percentage'] = $totalAssessments > 0 ? round(($tier['count'] / $totalAssessments) * 100, 1) : 0;
        }

        // 5. Top 5 Recommended Universities
        $totalMatches = Recommendation::count();
        $topUniversities = Recommendation::join('programmes', 'recommendations.programme_id', '=', 'programmes.id')
            ->selectRaw('programmes.institution, count(*) as match_count')
            ->groupBy('programmes.institution')
            ->orderByDesc('match_count')
            ->take(5)
            ->get()
            ->map(function ($item) use ($totalMatches) {
                return [
                    'institution' => $item->institution,
                    'count' => (int) $item->match_count,
                    'percentage' => $totalMatches > 0 ? round(($item->match_count / $totalMatches) * 100, 1) : 0,
                ];
            });

        // 6. Top 5 Recommended Programmes
        $topProgrammes = Recommendation::join('programmes', 'recommendations.programme_id', '=', 'programmes.id')
            ->selectRaw('programmes.id, programmes.name, programmes.code, programmes.institution, programmes.level, programmes.merit, count(*) as match_count')
            ->groupBy('programmes.id', 'programmes.name', 'programmes.code', 'programmes.institution', 'programmes.level', 'programmes.merit')
            ->orderByDesc('match_count')
            ->take(5)
            ->get();

        // 7. SPM Academic Stream Breakdown (Science vs Arts)
        $scienceUsers = SpmResult::where('stream', 'science')->distinct('user_id')->count('user_id');
        $artsUsers = SpmResult::where('stream', 'arts')->distinct('user_id')->count('user_id');
        $totalStreamUsers = $scienceUsers + $artsUsers;

        $streamBreakdown = [
            'science' => [
                'count' => $scienceUsers,
                'percentage' => $totalStreamUsers > 0 ? round(($scienceUsers / $totalStreamUsers) * 100, 1) : 0,
            ],
            'arts' => [
                'count' => $artsUsers,
                'percentage' => $totalStreamUsers > 0 ? round(($artsUsers / $totalStreamUsers) * 100, 1) : 0,
            ],
        ];

        // 8. Programme Type Matched by Merit per Figure 3.2.1.1.6
        $levelCounts = [
            'Diploma' => Programme::where('level', 'Diploma')->count(),
            'Foundation' => Programme::where('level', 'Foundation')->count(),
            'Certificate' => Programme::where('level', 'Certificate')->count(),
        ];

        $matchedByLevel = [
            'Diploma' => Recommendation::whereHas('programme', fn ($q) => $q->where('level', 'Diploma'))->count(),
            'Foundation' => Recommendation::whereHas('programme', fn ($q) => $q->where('level', 'Foundation'))->count(),
            'Certificate' => Recommendation::whereHas('programme', fn ($q) => $q->where('level', 'Certificate'))->count(),
        ];

        // 9. System Activity Feed
        $activities = [];

        // Recent users
        $recentUsers = User::where('role', 'user')->orderBy('created_at', 'desc')->take(3)->get();
        foreach ($recentUsers as $u) {
            $activities[] = [
                'type' => 'user',
                'title' => 'Pendaftaran Pelajar Baru',
                'detail' => $u->name . ' (' . $u->email . ')',
                'time' => $u->created_at->diffForHumans(),
                'timestamp' => $u->created_at->timestamp,
            ];
        }

        // Recent completed recommendation sessions
        $recentRecs = Recommendation::with(['user', 'programme'])
            ->orderBy('date_generated', 'desc')
            ->take(4)
            ->get();

        foreach ($recentRecs as $rec) {
            $activities[] = [
                'type' => 'recommendation',
                'title' => 'Padanan Program RIASEC & Merit',
                'detail' => ($rec->user?->name ?? 'Pelajar') . ' dipadankan dengan ' . ($rec->programme?->name ?? 'Program') . ' (' . ($rec->merit_score ?? 0) . '%)',
                'time' => $rec->date_generated?->diffForHumans() ?? 'baru sahaja',
                'timestamp' => $rec->date_generated?->timestamp ?? now()->timestamp,
            ];
        }

        // Recent programmes
        $recentProgs = Programme::orderBy('created_at', 'desc')->take(2)->get();
        foreach ($recentProgs as $p) {
            $activities[] = [
                'type' => 'programme',
                'title' => 'Program IPTA Dikemas kini',
                'detail' => ($p->code ? '[' . $p->code . '] ' : '') . $p->name . ' - ' . $p->institution,
                'time' => $p->created_at ? $p->created_at->diffForHumans() : 'baru sahaja',
                'timestamp' => $p->created_at ? $p->created_at->timestamp : now()->timestamp,
            ];
        }

        usort($activities, fn ($a, $b) => $b['timestamp'] <=> $a['timestamp']);
        $activities = array_slice($activities, 0, 6);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalAssessments' => $totalAssessments,
                'totalProgrammes' => $totalProgrammes,
                'totalQuestions' => $totalQuestions,
                'totalRules' => $totalRules,
                'totalUniversities' => $totalUniversities,
                'avgMerit' => $avgMerit,
                'maxMerit' => $maxMerit,
                'minMerit' => $minMerit,
            ],
            'riasecDistribution' => $riasecDistribution,
            'meritDistribution' => $meritTiers,
            'topUniversities' => $topUniversities,
            'topProgrammes' => $topProgrammes,
            'streamBreakdown' => $streamBreakdown,
            'chartData' => [
                'levels' => ['Diploma', 'Foundation', 'Certificate'],
                'available' => array_values($levelCounts),
                'matched' => array_values($matchedByLevel),
            ],
            'activities' => $activities,
        ]);
    }
}
