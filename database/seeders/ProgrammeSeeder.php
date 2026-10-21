<?php

namespace Database\Seeders;

use App\Models\Programme;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class ProgrammeSeeder extends Seeder
{
    public function run(): void
    {
        $jsonPath = database_path('data/programmes.json');
        
        if (File::exists($jsonPath)) {
            $programmes = json_decode(File::get($jsonPath), true);
            foreach ($programmes as $p) {
                Programme::updateOrCreate(
                    [
                        'name' => $p['name'],
                        'institution' => $p['institution'],
                    ],
                    [
                        'code' => $p['code'] ?? null,
                        'level' => $p['level'],
                        'merit' => $p['merit'] ?? null,
                        'entry_requirement' => $p['entry_requirement'],
                        'notes' => $p['notes'] ?? null,
                    ]
                );
            }
        }
    }
}