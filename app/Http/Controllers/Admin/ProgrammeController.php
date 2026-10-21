<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Programme;
use App\Models\RecommendationRule;
use App\Models\University;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProgrammeController extends Controller
{
    /**
     * Display list of programmes with search, level and institution filters (SRS Figure 3.2.1.7.2).
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $level = $request->input('level');
        $institution = $request->input('institution');

        $query = Programme::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($level && $level !== 'all') {
            $query->where('level', $level);
        }

        if ($institution && $institution !== 'all') {
            $query->where('institution', $institution);
        }

        $programmes = $query->orderBy('name', 'asc')
            ->paginate(12)
            ->withQueryString();

        // Get institutions list from universities table or existing programmes
        $institutions = University::orderBy('name')->pluck('name')->toArray();
        if (empty($institutions)) {
            $institutions = Programme::select('institution')->distinct()->orderBy('institution')->pluck('institution')->toArray();
        }

        return Inertia::render('Admin/Programmes/Index', [
            'programmes' => $programmes,
            'institutions' => $institutions,
            'filters' => [
                'search' => $search ?? '',
                'level' => $level ?? 'all',
                'institution' => $institution ?? 'all',
            ],
        ]);
    }

    /**
     * Store a newly created programme (SRS Figure 3.2.1.7.3).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:50'],
            'level' => ['required', 'in:Diploma,Foundation,Certificate'],
            'institution' => ['required', 'string', 'max:255'],
            'merit' => ['nullable', 'numeric', 'between:0,100'],
            'entry_requirement' => ['required', 'string'],
            'notes' => ['nullable', 'string', 'max:255'],
            'riasec_type' => ['nullable', 'in:Realistic,Investigative,Artistic,Social,Enterprising,Conventional'],
            'min_grade' => ['nullable', 'string', 'max:5'],
        ]);

        $programme = Programme::create([
            'name' => $validated['name'],
            'code' => $validated['code'] ?? null,
            'level' => $validated['level'],
            'institution' => $validated['institution'],
            'merit' => $validated['merit'] ?? null,
            'entry_requirement' => $validated['entry_requirement'],
            'notes' => $validated['notes'] ?? null,
        ]);

        // If RIASEC type specified, create recommendation rule as well
        if (!empty($validated['riasec_type'])) {
            RecommendationRule::create([
                'programme_id' => $programme->id,
                'riasec_type' => $validated['riasec_type'],
                'min_grade' => $validated['min_grade'] ?? 'C',
            ]);
        }

        return redirect()->back()->with('success', 'NEW PROGRAMME SUCCESSFULLY ADDED');
    }

    /**
     * Update the specified programme (SRS Figure 3.2.1.7.8).
     */
    public function update(Request $request, Programme $programme)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:50'],
            'level' => ['required', 'in:Diploma,Foundation,Certificate'],
            'institution' => ['required', 'string', 'max:255'],
            'merit' => ['nullable', 'numeric', 'between:0,100'],
            'entry_requirement' => ['required', 'string'],
            'notes' => ['nullable', 'string', 'max:255'],
        ]);

        $programme->update($validated);

        return redirect()->back()->with('success', 'PROGRAMME UPDATE SUCCESSFULLY');
    }

    /**
     * Remove the specified programme (SRS Figure 3.2.1.7.6).
     */
    public function destroy(Programme $programme)
    {
        $programme->delete();

        return redirect()->back()->with('success', 'PROGRAMME DELETE SUCCESSFULLY');
    }
}
