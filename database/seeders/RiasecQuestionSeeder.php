<?php

namespace Database\Seeders;

use App\Models\RiasecQuestion;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class RiasecQuestionSeeder extends Seeder
{
    public function run(): void
    {
        $jsonPath = database_path('data/imks_questions.json');

        if (!File::exists($jsonPath)) {
            return;
        }

        $questions = json_decode(File::get($jsonPath), true);
        if (!is_array($questions)) {
            return;
        }

        // Remove legacy 30-item non-IMKS sample rows so the assessment cleanly serves the 170 IMKS items
        RiasecQuestion::whereNull('question_number')->delete();

        foreach ($questions as $q) {
            RiasecQuestion::updateOrCreate(
                ['question_number' => $q['question_number']],
                [
                    'section' => $q['section'],
                    'cluster_index' => $q['cluster_index'],
                    'cluster_code' => $q['cluster_code'],
                    'cluster_name' => $q['cluster_name'],
                    'holland_code' => $q['holland_code'],
                    'question_text' => $q['question_text'],
                    'category' => $q['category'],
                ]
            );
        }
    }
}
