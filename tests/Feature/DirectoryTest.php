<?php

namespace Tests\Feature;

use App\Models\Programme;
use App\Models\SpmResult;
use App\Models\University;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DirectoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_access_directory_page(): void
    {
        University::create(['name' => 'Universiti Pendidikan Sultan Idris', 'code' => 'UPSI']);
        Programme::create([
            'name' => 'DIPLOMA SAINS KOMPUTER',
            'code' => 'A2000',
            'level' => 'Diploma',
            'institution' => 'Universiti Pendidikan Sultan Idris',
            'merit' => 84.50,
            'entry_requirement' => 'Lulus SPM dengan 5 kepujian.',
            'notes' => 'STEM',
        ]);

        $response = $this->get('/directory');

        $response->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Directory/Index')
                ->has('programmes')
                ->has('universities')
                ->has('stats')
                ->where('userMeritScore', null)
            );
    }

    public function test_authenticated_user_with_spm_gets_calculated_merit_in_directory(): void
    {
        $user = User::factory()->create(['role' => 'user', 'status' => 'active']);

        // Create 5 SPM results
        $subjects = [
            ['subject' => 'Bahasa Melayu', 'grade' => 'A'],
            ['subject' => 'Bahasa Inggeris', 'grade' => 'A'],
            ['subject' => 'Sejarah', 'grade' => 'A'],
            ['subject' => 'Matematik', 'grade' => 'A'],
            ['subject' => 'Pendidikan Islam', 'grade' => 'A'],
        ];

        foreach ($subjects as $s) {
            SpmResult::create([
                'user_id' => $user->id,
                'stream' => 'science',
                'subject' => $s['subject'],
                'grade' => $s['grade'],
            ]);
        }

        $response = $this->actingAs($user)->get('/directory');

        $response->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Directory/Index')
                ->has('programmes')
                ->whereNot('userMeritScore', null)
            );
    }
}
