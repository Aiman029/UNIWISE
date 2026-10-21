<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RiasecQuestionSeeder::class,
            UniversitySeeder::class,
            ProgrammeSeeder::class,
            RecommendationRuleSeeder::class,
            AdminSeeder::class,
        ]);
    }
}