<?php

namespace Tests\Feature;

use App\Models\Programme;
use App\Models\RecommendationRule;
use App\Models\RiasecQuestion;
use App\Models\SpmResult;
use App\Models\User;
use App\Services\ImksCalculator;
use Database\Seeders\ProgrammeSeeder;
use Database\Seeders\RecommendationRuleSeeder;
use Database\Seeders\RiasecQuestionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RiasecRecommendationTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeder_creates_two_or_three_ordered_riasec_rules_for_all_programmes(): void
    {
        $this->seed([
            ProgrammeSeeder::class,
            RecommendationRuleSeeder::class,
        ]);

        $programmes = Programme::with('rules')->get();
        $this->assertCount(236, $programmes);

        foreach ($programmes as $programme) {
            $types = $programme->getOrderedRiasecTypes();
            $this->assertGreaterThanOrEqual(2, count($types), "Programme {$programme->name} should have at least 2 RIASEC types");
            $this->assertLessThanOrEqual(3, count($types), "Programme {$programme->name} should have at most 3 RIASEC types");
        }

        // Verify ID 1 DIPLOMA BAHASA ETNIK preserves Primary -> Sub ordering
        $bahasaEtnik = Programme::with('rules')->where('code', 'UA4222001')->first();
        $this->assertNotNull($bahasaEtnik);
        $this->assertSame(['Artistic', 'Social', 'Enterprising'], $bahasaEtnik->getOrderedRiasecTypes());
    }

    public function test_riasec_submit_matches_top_2_and_3_traits_and_exposes_multi_badges(): void
    {
        $this->seed([
            ProgrammeSeeder::class,
            RecommendationRuleSeeder::class,
        ]);

        $user = User::factory()->create(['role' => 'user', 'status' => 'active']);

        foreach (['Bahasa Melayu', 'Bahasa Inggeris', 'Matematik', 'Sejarah', 'Pendidikan Seni Visual'] as $subject) {
            SpmResult::create([
                'user_id' => $user->id,
                'stream' => 'Sastera / Kemanusiaan',
                'subject' => $subject,
                'grade' => 'A',
            ]);
        }

        // Create 5 questions per RIASEC trait (30 total)
        $traitScores = [
            'Artistic' => 5,
            'Social' => 4,
            'Enterprising' => 3,
            'Investigative' => 1,
            'Conventional' => 1,
            'Realistic' => 0,
        ];

        $answers = [];
        foreach ($traitScores as $trait => $yesCount) {
            for ($i = 1; $i <= 5; $i++) {
                $q = RiasecQuestion::create([
                    'category' => $trait,
                    'question_text' => "{$trait} Q{$i}",
                ]);
                $answers[] = [
                    'question_id' => $q->id,
                    'value' => $i <= $yesCount ? 1 : 0,
                ];
            }
        }

        $submitResponse = $this->actingAs($user)->post('/riasec/submit', [
            'answers' => $answers,
        ]);

        $submitResponse->assertRedirect();
        $location = $submitResponse->headers->get('Location');
        $this->assertStringContainsString('/riasec/result/', $location);

        $resultResponse = $this->actingAs($user)->get($location);
        $resultResponse->assertStatus(200)
            ->assertInertia(function ($page) {
                $page->component('Riasec/Result')
                    ->where('dominantTrait', 'Artistic')
                    ->has('topTraits', 3)
                    ->where('topTraits.0.trait', 'Artistic')
                    ->where('topTraits.1.trait', 'Social')
                    ->where('topTraits.2.trait', 'Enterprising')
                    ->has('programmes');

                $programmes = $page->toArray()['props']['programmes'];
                $this->assertNotEmpty($programmes);

                $topMatched = $programmes[0];
                $this->assertIsArray($topMatched['riasec_types']);
                $this->assertGreaterThanOrEqual(2, count($topMatched['riasec_types']));
                $this->assertNotEmpty($topMatched['riasec_match']);
                $this->assertGreaterThanOrEqual(2, $topMatched['riasec_match']['matched_count']);
            });

        // Verify History detail also renders enriched multi-RIASEC programmes
        $sessionId = basename(parse_url($location, PHP_URL_PATH));
        $historyResponse = $this->actingAs($user)->get("/history/{$sessionId}");
        $historyResponse->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('History/Show')
                ->has('topTraits', 3)
                ->has('programmes.0.riasec_types')
            );

        // Verify Directory exposes all 2-3 ordered riasec_types
        $dirResponse = $this->actingAs($user)->get('/directory');
        $dirResponse->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Directory/Index')
                ->has('userTopTraits', 3)
                ->has('programmes.0.riasec_types')
            );
    }

    public function test_single_rule_legacy_programme_still_matches_via_fallback(): void
    {
        $prog = Programme::create([
            'name' => 'DIPLOMA TEST LEGASI',
            'code' => 'LEG01',
            'level' => 'Diploma',
            'institution' => 'Universiti Awam Test',
            'merit' => 75.0,
            'entry_requirement' => 'Lulus SPM.',
            'notes' => '-',
        ]);

        RecommendationRule::create([
            'programme_id' => $prog->id,
            'riasec_type' => 'Investigative',
            'min_grade' => 'C',
        ]);

        $user = User::factory()->create(['role' => 'user', 'status' => 'active']);
        SpmResult::create([
            'user_id' => $user->id,
            'stream' => 'Sains',
            'subject' => 'Bahasa Melayu',
            'grade' => 'B',
        ]);

        $q1 = RiasecQuestion::create(['category' => 'Investigative', 'question_text' => 'I Q1']);
        $q2 = RiasecQuestion::create(['category' => 'Realistic', 'question_text' => 'R Q1']);

        $response = $this->actingAs($user)->post('/riasec/submit', [
            'answers' => [
                ['question_id' => $q1->id, 'value' => 1],
                ['question_id' => $q2->id, 'value' => 1],
            ],
        ]);

        $response->assertRedirect();
        $resultResponse = $this->actingAs($user)->get($response->headers->get('Location'));
        $resultResponse->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Riasec/Result')
                ->has('programmes', 1)
                ->where('programmes.0.code', 'LEG01')
            );
    }

    public function test_imks_seeder_and_170_question_submission_pipeline(): void
    {
        $this->seed([
            RiasecQuestionSeeder::class,
            ProgrammeSeeder::class,
            RecommendationRuleSeeder::class,
        ]);

        $questions = RiasecQuestion::orderBy('question_number')->get();
        $this->assertCount(170, $questions);
        $this->assertSame('PPR-R', $questions->first()->cluster_code);
        $this->assertSame('KON-C', $questions->last()->cluster_code);

        $user = User::factory()->create(['role' => 'user', 'status' => 'active']);
        SpmResult::create([
            'user_id' => $user->id,
            'stream' => 'Sastera / Kemanusiaan',
            'subject' => 'Bahasa Melayu',
            'grade' => 'A',
        ]);

        // Replicate README.md simulation (ASI): PPR-R=6, PLD-R=4, MHR-R=5, KEJ-R=5, etc.
        $clusterTargets = [
            'PPR-R' => 6, 'PLD-R' => 4, 'MHR-R' => 5, 'KEJ-R' => 5,
            'SMT-I' => 8, 'KDP-I' => 7, 'UBT-I' => 6,
            'SHI-A' => 9, 'UND-A' => 8,
            'SUK-S' => 7, 'SDN-S' => 8, 'SOS-S' => 9,
            'TBR-E' => 5, 'ANP-E' => 4, 'NGA-E' => 3,
            'KER-C' => 6, 'KON-C' => 6,
        ];

        $answers = [];
        $grouped = $questions->groupBy('cluster_code');
        foreach ($grouped as $clusterCode => $items) {
            $yesNeeded = $clusterTargets[$clusterCode] ?? 0;
            foreach ($items->values() as $idx => $q) {
                $answers[] = [
                    'question_id' => $q->id,
                    'value' => $idx < $yesNeeded ? 'Y' : 'T',
                ];
            }
        }

        $submitResponse = $this->actingAs($user)->post('/riasec/submit', [
            'answers' => $answers,
        ]);

        $submitResponse->assertRedirect();
        $location = $submitResponse->headers->get('Location');

        $resultResponse = $this->actingAs($user)->get($location);
        $resultResponse->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Riasec/Result')
                ->where('dominantTrait', 'Artistic')
                ->where('imksResult.holland_code_display', 'ASI')
                ->where('imksResult.riasec_exact.A', 8.5)
                ->where('imksResult.riasec_rounded.A', 9)
                ->where('topTraits.0.trait', 'Artistic')
                ->where('topTraits.1.trait', 'Social')
                ->where('topTraits.2.trait', 'Investigative')
                ->has('programmes')
            );
    }
}

