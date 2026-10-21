<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Programme;
use App\Models\RecommendationRule;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RecommendationRuleController extends Controller
{
    /**
     * Display list of recommendation rules (SRS Figure 3.2.1.9.2).
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $riasecType = $request->input('riasec_type');

        $query = RecommendationRule::with('programme');

        if ($search) {
            $query->whereHas('programme', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('institution', 'like', "%{$search}%");
            });
        }

        if ($riasecType && $riasecType !== 'all') {
            $query->where('riasec_type', $riasecType);
        }

        $rules = $query->orderBy('id', 'desc')
            ->paginate(12)
            ->withQueryString();

        $programmes = Programme::orderBy('name')->get(['id', 'name', 'code', 'institution', 'level']);

        return Inertia::render('Admin/Rules/Index', [
            'rules' => $rules,
            'programmes' => $programmes,
            'filters' => [
                'search' => $search ?? '',
                'riasec_type' => $riasecType ?? 'all',
            ],
            'categories' => ['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional'],
            'grades' => ['A+', 'A', 'A-', 'B+', 'B', 'C+', 'C', 'D', 'E', 'G'],
        ]);
    }

    /**
     * Store a newly created recommendation rule (SRS Figure 3.2.1.9.8).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'riasec_type' => ['required', 'in:Realistic,Investigative,Artistic,Social,Enterprising,Conventional'],
            'programme_id' => ['required', 'exists:programmes,id'],
            'min_grade' => ['required', 'in:A+,A,A-,B+,B,C+,C,D,E,G'],
        ]);

        RecommendationRule::create($validated);

        return redirect()->back()->with('success', 'NEW RULE SUCCESSFULLY ADDED');
    }

    /**
     * Update the specified recommendation rule (SRS Figure 3.2.1.9.4).
     */
    public function update(Request $request, RecommendationRule $rule)
    {
        $validated = $request->validate([
            'riasec_type' => ['required', 'in:Realistic,Investigative,Artistic,Social,Enterprising,Conventional'],
            'programme_id' => ['required', 'exists:programmes,id'],
            'min_grade' => ['required', 'in:A+,A,A-,B+,B,C+,C,D,E,G'],
        ]);

        $rule->update($validated);

        return redirect()->back()->with('success', 'RULE UPDATE SUCCESSFULLY');
    }

    /**
     * Remove the specified recommendation rule (SRS Figure 3.2.1.9.6).
     */
    public function destroy(RecommendationRule $rule)
    {
        $rule->delete();

        return redirect()->back()->with('success', 'RULE DELETE SUCCESSFULLY');
    }
}
