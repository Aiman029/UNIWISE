<?php

namespace Database\Seeders;

use App\Models\Programme;
use App\Models\Recommendation;
use App\Models\RecommendationRule;
use App\Models\RiasecQuestion;
use App\Models\RiasecResponse;
use App\Models\SpmResult;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DemoAnalyticsSeeder extends Seeder
{
    public function run(): void
    {
        // Sample SPM candidate profiles with diverse traits and merits
        $students = [
            [
                'name' => 'Nur Aina binti Rosli',
                'email' => 'aina@example.com',
                'stream' => 'science',
                'trait' => 'Investigative',
                'merit' => 93.45,
                'days_ago' => 1,
            ],
            [
                'name' => 'Muhammad Haziq bin Zulkifli',
                'email' => 'haziq@example.com',
                'stream' => 'science',
                'trait' => 'Realistic',
                'merit' => 88.20,
                'days_ago' => 2,
            ],
            [
                'name' => 'Chong Wei Lun',
                'email' => 'weilun@example.com',
                'stream' => 'science',
                'trait' => 'Investigative',
                'merit' => 91.10,
                'days_ago' => 3,
            ],
            [
                'name' => 'Siti Sarah binti Ahmad',
                'email' => 'sarah@example.com',
                'stream' => 'arts',
                'trait' => 'Social',
                'merit' => 84.75,
                'days_ago' => 4,
            ],
            [
                'name' => 'Kavitha a/p Ramesh',
                'email' => 'kavitha@example.com',
                'stream' => 'arts',
                'trait' => 'Artistic',
                'merit' => 79.50,
                'days_ago' => 5,
            ],
            [
                'name' => 'Danial Hakim bin Razak',
                'email' => 'danial@example.com',
                'stream' => 'arts',
                'trait' => 'Enterprising',
                'merit' => 82.60,
                'days_ago' => 6,
            ],
            [
                'name' => 'Nurul Izzah binti Kamal',
                'email' => 'izzah@example.com',
                'stream' => 'arts',
                'trait' => 'Conventional',
                'merit' => 76.30,
                'days_ago' => 8,
            ],
            [
                'name' => 'Amirul Asyraf bin Yusof',
                'email' => 'amirul@example.com',
                'stream' => 'science',
                'trait' => 'Realistic',
                'merit' => 85.90,
                'days_ago' => 10,
            ],
            [
                'name' => 'Lee Jia Xin',
                'email' => 'jiaxin@example.com',
                'stream' => 'arts',
                'trait' => 'Social',
                'merit' => 89.15,
                'days_ago' => 12,
            ],
            [
                'name' => 'Harith Iskandar bin Mazlan',
                'email' => 'harith@example.com',
                'stream' => 'arts',
                'trait' => 'Enterprising',
                'merit' => 67.80,
                'days_ago' => 14,
            ],
            [
                'name' => 'Wan Farah binti Wan Daud',
                'email' => 'farah@example.com',
                'stream' => 'arts',
                'trait' => 'Artistic',
                'merit' => 72.40,
                'days_ago' => 16,
            ],
            [
                'name' => 'Mohd Faiz bin Zakaria',
                'email' => 'faiz@example.com',
                'stream' => 'science',
                'trait' => 'Conventional',
                'merit' => 64.50,
                'days_ago' => 20,
            ],
        ];

        foreach ($students as $stu) {
            $user = User::firstOrCreate(
                ['email' => $stu['email']],
                [
                    'name' => $stu['name'],
                    'password' => Hash::make('password123'),
                    'role' => 'user',
                    'status' => 'active',
                    'created_at' => now()->subDays($stu['days_ago'] + 1),
                ]
            );

            // Seed basic SPM subjects
            SpmResult::where('user_id', $user->id)->delete();
            $subjects = [
                ['subject' => 'Bahasa Melayu', 'grade' => 'A'],
                ['subject' => 'Bahasa Inggeris', 'grade' => 'A-'],
                ['subject' => 'Sejarah', 'grade' => 'B+'],
                ['subject' => 'Matematik', 'grade' => 'A'],
                ['subject' => 'Pendidikan Islam', 'grade' => 'A'],
            ];

            if ($stu['stream'] === 'science') {
                $subjects[] = ['subject' => 'Fizik', 'grade' => 'B+'];
                $subjects[] = ['subject' => 'Kimia', 'grade' => 'B'];
                $subjects[] = ['subject' => 'Biologi', 'grade' => 'B+'];
            } else {
                $subjects[] = ['subject' => 'Perniagaan', 'grade' => 'A'];
                $subjects[] = ['subject' => 'Prinsip Perakaunan', 'grade' => 'B+'];
                $subjects[] = ['subject' => 'Ekonomi', 'grade' => 'A-'];
            }

            foreach ($subjects as $s) {
                SpmResult::create([
                    'user_id' => $user->id,
                    'stream' => $stu['stream'],
                    'subject' => $s['subject'],
                    'grade' => $s['grade'],
                ]);
            }

            // Create a realistic Recommendation session
            Recommendation::where('user_id', $user->id)->delete();
            $sessionId = (string) Str::uuid();
            $dateGenerated = now()->subDays($stu['days_ago']);

            // Find matching programmes by RIASEC rule
            $matchedRules = RecommendationRule::with('programme')
                ->where('riasec_type', $stu['trait'])
                ->take(6)
                ->get();

            $programmes = $matchedRules->pluck('programme')->filter()->unique('id');

            // Fallback if rules don't return enough programmes
            if ($programmes->isEmpty()) {
                $programmes = Programme::inRandomOrder()->take(5)->get();
            }

            // Construct score profile where dominant trait is highest
            $scores = [
                'Realistic' => rand(1, 4),
                'Investigative' => rand(1, 4),
                'Artistic' => rand(1, 4),
                'Social' => rand(1, 4),
                'Enterprising' => rand(1, 4),
                'Conventional' => rand(1, 4),
            ];
            $scores[$stu['trait']] = 5; // ensure it's dominant

            foreach ($programmes as $prog) {
                Recommendation::create([
                    'user_id' => $user->id,
                    'programme_id' => $prog->id,
                    'session_id' => $sessionId,
                    'merit_score' => $stu['merit'],
                    'dominant_trait' => $stu['trait'],
                    'riasec_scores' => $scores,
                    'spm_snapshot' => $subjects,
                    'date_generated' => $dateGenerated,
                    'created_at' => $dateGenerated,
                    'updated_at' => $dateGenerated,
                ]);
            }
        }
    }
}
