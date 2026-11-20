<?php

namespace Tests\Feature;

use App\Models\Programme;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminManagementTest extends TestCase
{
    use RefreshDatabase;
    public function test_admin_can_access_all_management_modules(): void
    {
        $admin = User::where('role', 'admin')->first() ?? User::factory()->create(['role' => 'admin', 'status' => 'active']);

        $response = $this->actingAs($admin)->get('/admin/dashboard');
        $response->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Dashboard')
                ->has('stats')
                ->has('riasecDistribution')
                ->has('meritDistribution')
                ->has('topUniversities')
                ->has('topProgrammes')
            );

        $response = $this->actingAs($admin)->get('/admin/users');
        $response->assertStatus(200);

        $response = $this->actingAs($admin)->get('/admin/programmes');
        $response->assertStatus(200);

        $response = $this->actingAs($admin)->get('/admin/riasec-questions');
        $response->assertStatus(200);

        $response = $this->actingAs($admin)->get('/admin/recommendation-rules');
        $response->assertStatus(200);
    }

    public function test_admin_can_create_and_delete_programme(): void
    {
        $admin = User::where('role', 'admin')->first() ?? User::factory()->create(['role' => 'admin', 'status' => 'active']);

        $response = $this->actingAs($admin)->post('/admin/programmes', [
            'name' => 'DIPLOMA TEKNOLOGI BARU TEST',
            'code' => 'TEST9999',
            'level' => 'Diploma',
            'institution' => 'Universiti Pendidikan Sultan Idris',
            'merit' => 85.50,
            'entry_requirement' => 'Lulus SPM dengan kepujian Matematik.',
            'notes' => 'STEM',
            'riasec_type' => 'Realistic',
            'min_grade' => 'C',
        ]);

        $response->assertSessionHas('success', 'PROGRAM BAHARU BERJAYA DITAMBAH');

        $prog = Programme::where('code', 'TEST9999')->first();
        $this->assertNotNull($prog);

        $deleteResponse = $this->actingAs($admin)->delete("/admin/programmes/{$prog->id}");
        $deleteResponse->assertSessionHas('success', 'PROGRAM BERJAYA DIPADAM');
        $this->assertNull(Programme::where('code', 'TEST9999')->first());
    }
}
