<?php

namespace App\Http\Controllers;

use App\Models\SpmResult;
use App\Services\MeritCalculator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AcademicResultController extends Controller
{
    public const UNIVERSAL_SUBJECTS = [
        'Bahasa Melayu',
        'Bahasa Inggeris',
        'Matematik',
        'Sejarah',
    ];

    public const AVAILABLE_ELECTIVES = [
        'Matematik Tambahan',
        'Fizik',
        'Kimia',
        'Biologi',
        'Pendidikan Islam',
        'Pendidikan Moral',
        'Pendidikan Seni Visual',
        'Prinsip Perakaunan',
        'Ekonomi',
        'Perniagaan',
        'Geografi',
        'Sains Komputer',
        'Grafik Komunikasi Teknikal',
        'Asas Kelestarian',
        'Tasawwur Islam',
        'Bahasa Arab',
        'Bahasa Cina',
        'Bahasa Tamil',
        'Kesusasteraan Melayu',
    ];

    public const STREAMS = [
        'STEM A (Fizik, Kimia, Matematik Tambahan)',
        'STEM B (Biologi, Kimia, Fizik/Matematik Tambahan)',
        'STEM C (Teknikal & Vokasional)',
        'Sastera & Kemanusiaan',
        'Perniagaan & Perakaunan',
        'Agama',
    ];

    public const GRADES = ['A+', 'A', 'A-', 'B+', 'B', 'C+', 'C', 'D', 'E', 'G'];

    public function index(Request $request): Response
    {
        $existing = SpmResult::where('user_id', $request->user()->id)->get();
        $stream = $existing->first()?->stream ?? '';

        $meritScore = MeritCalculator::calculate($existing->toArray());

        return Inertia::render('Academic/Index', [
            'existingResults' => $existing,
            'existingStream' => $stream,
            'meritScore' => $meritScore,
            'universalSubjects' => self::UNIVERSAL_SUBJECTS,
            'availableElectives' => self::AVAILABLE_ELECTIVES,
            'streams' => self::STREAMS,
            'grades' => self::GRADES,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'stream' => 'required|string',
            'results' => 'required|array|min:5',
            'results.*.subject' => 'required|string',
            'results.*.grade' => 'required|string|in:' . implode(',', self::GRADES),
        ]);

        $subjects = array_map(fn ($r) => trim($r['subject']), $request->results);

        // Check for duplicates
        if (count($subjects) !== count(array_unique($subjects))) {
            return back()->withErrors([
                'duplicate' => 'SUBJECT DUPLICATE',
            ])->with('error', 'SUBJECT DUPLICATE');
        }

        // Verify all universal subjects are present
        foreach (self::UNIVERSAL_SUBJECTS as $mandatory) {
            if (! in_array($mandatory, $subjects)) {
                return back()->withErrors([
                    'universal' => "Mata pelajaran wajib '$mandatory' mesti dipilih.",
                ])->with('error', "Mata pelajaran wajib '$mandatory' mesti dipilih.");
            }
        }

        $userId = $request->user()->id;
        $stream = $request->stream;

        // Replace previous results with updated set
        SpmResult::where('user_id', $userId)->delete();

        foreach ($request->results as $row) {
            if (! empty($row['subject']) && ! empty($row['grade'])) {
                SpmResult::create([
                    'user_id' => $userId,
                    'stream' => $stream,
                    'subject' => trim($row['subject']),
                    'grade' => trim($row['grade']),
                ]);
            }
        }

        return redirect()->route('dashboard')->with('success', 'ACADEMIC RESULT SUCCESSFULLY ADDED');
    }
}
