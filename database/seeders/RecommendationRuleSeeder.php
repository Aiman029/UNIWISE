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

                if ($prog) {
                    $riasecTypes = $item['riasec_types'] ?? array_values(array_unique(array_filter(array_merge(
                        !empty($item['riasec_type']) ? [$item['riasec_type']] : [],
                        $item['sub_riasec_type'] ?? []
                    ))));

                    if (!empty($riasecTypes)) {
                        // Replace all rules for this programme cleanly so id ordering always keeps Primary -> Sub 1 -> Sub 2
                        RecommendationRule::where('programme_id', $prog->id)->delete();

                        foreach ($riasecTypes as $type) {
                            RecommendationRule::create([
                                'programme_id' => $prog->id,
                                'riasec_type' => $type,
                                'min_grade' => $item['min_grade'] ?? 'C',
                            ]);
                        }
                    }
                }
            }
        }
    }
}