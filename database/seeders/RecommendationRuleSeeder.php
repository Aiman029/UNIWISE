<?php

namespace Database\Seeders;

use App\Models\RecommendationRule;
use Illuminate\Database\Seeder;

class RecommendationRuleSeeder extends Seeder
{
    public function run(): void
    {
        $rules = [
            // Realistic -> mechanical/technical programmes
            ['riasec_type' => 'Realistic', 'programme_id' => 1, 'min_grade' => 'C'],
            ['riasec_type' => 'Realistic', 'programme_id' => 2, 'min_grade' => 'C'],
            ['riasec_type' => 'Realistic', 'programme_id' => 3, 'min_grade' => 'D'],
            ['riasec_type' => 'Realistic', 'programme_id' => 18, 'min_grade' => 'C'],

            // Investigative -> science/tech programmes
            ['riasec_type' => 'Investigative', 'programme_id' => 4, 'min_grade' => 'C'],
            ['riasec_type' => 'Investigative', 'programme_id' => 5, 'min_grade' => 'C'],
            ['riasec_type' => 'Investigative', 'programme_id' => 17, 'min_grade' => 'B'],
            ['riasec_type' => 'Investigative', 'programme_id' => 19, 'min_grade' => 'C'],

            // Artistic -> design/creative programmes
            ['riasec_type' => 'Artistic', 'programme_id' => 7, 'min_grade' => 'D'],
            ['riasec_type' => 'Artistic', 'programme_id' => 8, 'min_grade' => 'C'],
            ['riasec_type' => 'Artistic', 'programme_id' => 20, 'min_grade' => 'D'],

            // Social -> education/health/counselling programmes
            ['riasec_type' => 'Social', 'programme_id' => 6, 'min_grade' => 'C'],
            ['riasec_type' => 'Social', 'programme_id' => 9, 'min_grade' => 'C'],
            ['riasec_type' => 'Social', 'programme_id' => 10, 'min_grade' => 'C'],

            // Enterprising -> business/management/law programmes
            ['riasec_type' => 'Enterprising', 'programme_id' => 11, 'min_grade' => 'C'],
            ['riasec_type' => 'Enterprising', 'programme_id' => 12, 'min_grade' => 'D'],
            ['riasec_type' => 'Enterprising', 'programme_id' => 13, 'min_grade' => 'D'],
            ['riasec_type' => 'Enterprising', 'programme_id' => 14, 'min_grade' => 'C'],
            ['riasec_type' => 'Enterprising', 'programme_id' => 18, 'min_grade' => 'C'],

            // Conventional -> admin/accounting programmes
            ['riasec_type' => 'Conventional', 'programme_id' => 15, 'min_grade' => 'C'],
            ['riasec_type' => 'Conventional', 'programme_id' => 16, 'min_grade' => 'D'],
            ['riasec_type' => 'Conventional', 'programme_id' => 19, 'min_grade' => 'C'],
        ];

        foreach ($rules as $r) {
            RecommendationRule::create($r);
        }
    }
}