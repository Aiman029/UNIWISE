<?php

namespace Tests\Feature;

use App\Models\RiasecQuestion;
use App\Models\SpmResult;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AcademicResultTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_spm_results_page(): void
    {
        $user = User::factory()->create(['role' => 'user', 'status' => 'active']);

        $response = $this->actingAs($user)->get('/spm-results');
        $response->assertStatus(200)
            ->assertInertia(fn ($page) => $page->component('Academic/Index'));
    }

    public function test_user_can_submit_spm_results_and_then_access_riasec(): void
    {
        $user = User::factory()->create(['role' => 'user', 'status' => 'active']);

        // Before submitting SPM, accessing riasec should redirect to dashboard
        $preCheck = $this->actingAs($user)->get('/riasec');
        $preCheck->assertRedirect(route('dashboard'));
        $preCheck->assertSessionHas('error', 'Please complete Academic Results first');

        // Submit SPM academic results
        $payload = [
            'stream' => 'STEM A (Fizik, Kimia, Matematik Tambahan)',
            'results' => [
                ['subject' => 'Bahasa Melayu', 'grade' => 'A'],
                ['subject' => 'Bahasa Inggeris', 'grade' => 'A-'],
                ['subject' => 'Matematik', 'grade' => 'A+'],
                ['subject' => 'Sejarah', 'grade' => 'B+'],
                ['subject' => 'Fizik', 'grade' => 'B'],
                ['subject' => 'Kimia', 'grade' => 'B+'],
            ],
        ];

        $submitResponse = $this->actingAs($user)->post('/spm-results', $payload);
        $submitResponse->assertRedirect(route('dashboard'));
        $submitResponse->assertSessionHas('success', 'ACADEMIC RESULT SUCCESSFULLY ADDED');

        // Verify rows exist in database
        $this->assertEquals(6, SpmResult::where('user_id', $user->id)->count());
        $this->assertDatabaseHas('spm_results', [
            'user_id' => $user->id,
            'subject' => 'Bahasa Melayu',
            'grade' => 'A',
        ]);
        $this->assertDatabaseHas('spm_results', [
            'user_id' => $user->id,
            'subject' => 'Fizik',
            'grade' => 'B',
        ]);

        // Seed a question for riasec
        RiasecQuestion::create([
            'category' => 'Realistic',
            'question_text' => 'Saya suka membaiki barang elektrik atau mekanikal.',
        ]);

        // Now user can access riasec assessment successfully without being blocked!
        $riasecResponse = $this->actingAs($user)->get('/riasec');
        $riasecResponse->assertStatus(200);

        $quizResponse = $this->actingAs($user)->get('/riasec/quiz');
        $quizResponse->assertStatus(200);
    }
}
