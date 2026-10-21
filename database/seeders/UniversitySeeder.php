<?php

namespace Database\Seeders;

use App\Models\University;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class UniversitySeeder extends Seeder
{
    public function run(): void
    {
        $jsonPath = database_path('data/universities.json');
        if (!File::exists($jsonPath)) {
            return;
        }

        $universities = json_decode(File::get($jsonPath), true);

        foreach ($universities as $u) {
            University::updateOrCreate(
                ['code' => $u['code']],
                [
                    'name' => $u['name'],
                    'type' => $u['type'] ?? 'IPTA / Universiti Awam',
                ]
            );
        }
    }
}
