<?php

namespace Database\Seeders;

use App\Models\Programme;
use App\Models\RecommendationRule;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class RecommendationRuleSeeder extends Seeder
{
    public function run(): void
    {
        $jsonPath = database_path('data/programmes.json');
        
        if (File::exists($jsonPath)) {
            $programmesData = json_decode(File::get($jsonPath), true);

            foreach ($programmesData as $item) {
                $prog = Programme::where('code', $item['code'])
                    ->orWhere(function ($query) use ($item) {
                        $query->where('name', $item['name'])
                              ->where('institution', $item['institution']);
                    })
                    ->first();

                if ($prog && !empty($item['riasec_type'])) {
                    RecommendationRule::updateOrCreate(
                        [
                            'programme_id' => $prog->id,
                            'riasec_type' => $item['riasec_type'],
                        ],
                        [
                            'min_grade' => $item['min_grade'] ?? 'C',
                        ]
                    );
                }
            }
        }
    }
}