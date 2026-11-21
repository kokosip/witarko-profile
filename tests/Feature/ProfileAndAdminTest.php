<?php

namespace Tests\Feature;

use App\Models\Profile;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProfileAndAdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_page_renders_profile_and_non_archived_projects_without_admin_link(): void
    {
        $this->seed();

        Project::query()->create([
            'title' => 'Archived Secret App',
            'slug' => 'archived-secret-app',
            'status' => 'archived',
        ]);

        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertSee('Witarko');
        $response->assertSee('Stream TV');
        $response->assertDontSee('Archived Secret App');
    }

    public function test_unauthenticated_user_is_redirected_to_admin_login(): void
    {
        $this->get('/admin')->assertRedirect('/admin/login');
        $this->put('/admin/profile', [])->assertRedirect('/admin/login');
        $this->post('/admin/projects', [])->assertRedirect('/admin/login');
    }

    public function test_admin_can_login_and_logout(): void
    {
        $user = User::factory()->create([
            'email' => 'admin@witarko.local',
            'password' => 'password',
        ]);

        $this->get('/admin/login')
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page->component('AdminLogin'));

        $this->post('/admin/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ])->assertSessionHasErrors('email');

        $this->post('/admin/login', [
            'email' => $user->email,
            'password' => 'password',
        ])->assertRedirect('/admin');

        $this->assertAuthenticated();

        $this->post('/admin/logout')->assertRedirect('/');
        $this->assertGuest();
    }

    public function test_authenticated_admin_page_renders(): void
    {
        $this->seed();
        $user = User::query()->firstOrFail();

        $response = $this->actingAs($user)->get('/admin');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin')
            ->has('profile')
            ->has('projects', 6)
        );
    }

    public function test_admin_can_update_profile(): void
    {
        $this->seed();
        $user = User::query()->firstOrFail();

        $response = $this->actingAs($user)->put('/admin/profile', [
            'full_name' => 'Witarko Updated',
            'headline' => 'Senior Fullstack Engineer',
            'location' => 'Yogyakarta, Indonesia',
            'email' => 'witarko@example.com',
            'summary' => 'Ringkasan baru.',
            'github_url' => 'https://github.com/kokosip',
            'linkedin_url' => 'https://www.linkedin.com/in/kokosip/',
            'skills' => ['Laravel', 'PostgreSQL', 'React'],
            'experiences' => [
                [
                    'id' => 'exp-1',
                    'role' => 'Backend Engineer',
                    'company' => 'PT Contoh',
                    'period' => '2023 - Sekarang',
                    'location' => 'Yogyakarta',
                    'description' => 'Membangun API.',
                ],
            ],
            'educations' => [],
        ]);

        $response->assertRedirect();

        $profile = Profile::query()->first();
        $this->assertSame('Witarko Updated', $profile->full_name);
        $this->assertSame('Senior Fullstack Engineer', $profile->headline);
        $this->assertSame(['Laravel', 'PostgreSQL', 'React'], $profile->skills);
        $this->assertCount(1, $profile->experiences);
    }

    public function test_admin_can_create_update_and_delete_project(): void
    {
        $this->seed();
        $user = User::query()->firstOrFail();

        $createResponse = $this->actingAs($user)->post('/admin/projects', [
            'title' => 'Sistem Inventori',
            'description' => 'Aplikasi inventori berbasis web.',
            'subdomain_url' => 'https://inventori.witarko.dev',
            'github_url' => 'https://github.com/kokosip/inventori',
            'tech_stack' => ['Laravel', 'PostgreSQL'],
            'status' => 'published',
            'is_featured' => true,
            'sort_order' => 1,
        ]);

        $createResponse->assertRedirect();

        $project = Project::query()->where('slug', 'sistem-inventori')->first();
        $this->assertNotNull($project);
        $this->assertSame('https://inventori.witarko.dev', $project->subdomain_url);

        $updateResponse = $this->actingAs($user)->put("/admin/projects/{$project->id}", [
            'title' => 'Sistem Inventori v2',
            'description' => 'Versi terbaru.',
            'subdomain_url' => 'https://inv2.witarko.dev',
            'github_url' => 'https://github.com/kokosip/inventori',
            'tech_stack' => ['Laravel', 'Inertia'],
            'status' => 'coming_soon',
            'is_featured' => false,
            'sort_order' => 2,
        ]);

        $updateResponse->assertRedirect();
        $project->refresh();
        $this->assertSame('Sistem Inventori v2', $project->title);
        $this->assertSame('coming_soon', $project->status);

        $deleteResponse = $this->actingAs($user)->delete("/admin/projects/{$project->id}");
        $deleteResponse->assertRedirect();
        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }

    public function test_admin_can_create_closed_source_project_without_github_or_subdomain(): void
    {
        $this->seed();
        $user = User::query()->firstOrFail();

        $response = $this->actingAs($user)->post('/admin/projects', [
            'title' => 'Internal ERP',
            'description' => 'Aplikasi internal perusahaan.',
            'subdomain_url' => null,
            'github_url' => null,
            'tech_stack' => ['Laravel', 'PostgreSQL'],
            'status' => 'published',
            'is_featured' => false,
            'sort_order' => 1,
        ]);

        $response->assertRedirect();

        $project = Project::query()->where('slug', 'internal-erp')->first();
        $this->assertNotNull($project);
        $this->assertNull($project->github_url);
        $this->assertNull($project->subdomain_url);

        $this->get('/')->assertStatus(200)->assertSee('Internal ERP');
    }

    public function test_admin_can_upload_and_remove_profile_photo(): void
    {
        Storage::fake('public');
        $this->seed();
        $user = User::query()->firstOrFail();

        $file = UploadedFile::fake()->image('avatar.jpg', 200, 200);

        $response = $this->actingAs($user)->put('/admin/profile', [
            'full_name' => 'Witarko',
            'avatar_file' => $file,
        ]);

        $response->assertRedirect();

        $profile = Profile::query()->first();
        $this->assertNotNull($profile->avatar_url);
        $this->assertStringStartsWith('/storage/avatars/', $profile->avatar_url);

        $storedPath = str_replace('/storage/', '', $profile->avatar_url);
        Storage::disk('public')->assertExists($storedPath);

        $removeResponse = $this->actingAs($user)->put('/admin/profile', [
            'full_name' => 'Witarko',
            'remove_avatar' => true,
        ]);

        $removeResponse->assertRedirect();
        $profile->refresh();
        $this->assertNull($profile->avatar_url);
        Storage::disk('public')->assertMissing($storedPath);
    }
}
