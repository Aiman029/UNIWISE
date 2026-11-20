<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RiasecQuestion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RiasecQuestionController extends Controller
{
    /**
     * Display list of RIASEC assessment questions (SRS Figure 3.2.1.8.2).
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $category = $request->input('category');

        $query = RiasecQuestion::query();

        if ($search) {
            $query->where('question_text', 'like', "%{$search}%");
        }

        if ($category && $category !== 'all') {
            $query->where('category', $category);
        }

        $questions = $query->orderBy('id', 'asc')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Admin/RiasecQuestions/Index', [
            'questions' => $questions,
            'filters' => [
                'search' => $search ?? '',
                'category' => $category ?? 'all',
            ],
            'categories' => ['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional'],
        ]);
    }

    /**
     * Store a newly created RIASEC question (SRS Figure 3.2.1.8.8).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'question_text' => ['required', 'string', 'max:500'],
            'category' => ['required', 'in:Realistic,Investigative,Artistic,Social,Enterprising,Conventional'],
        ]);

        RiasecQuestion::create($validated);

        return redirect()->back()->with('success', 'SOALAN BAHARU BERJAYA DITAMBAH');
    }

    /**
     * Update the specified RIASEC question (SRS Figure 3.2.1.8.4).
     */
    public function update(Request $request, RiasecQuestion $question)
    {
        $validated = $request->validate([
            'question_text' => ['required', 'string', 'max:500'],
            'category' => ['required', 'in:Realistic,Investigative,Artistic,Social,Enterprising,Conventional'],
        ]);

        $question->update($validated);

        return redirect()->back()->with('success', 'SOALAN RIASEC BERJAYA DIKEMASKINI');
    }

    /**
     * Remove the specified RIASEC question (SRS Figure 3.2.1.8.6).
     */
    public function destroy(RiasecQuestion $question)
    {
        $question->delete();

        return redirect()->back()->with('success', 'SOALAN RIASEC BERJAYA DIPADAM');
    }
}
