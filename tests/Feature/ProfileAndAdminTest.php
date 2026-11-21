<?php

namespace Tests\Feature;

use App\Models\Profile;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProfileAndAdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_page_renders_profile_and_non_archived_projects(): void
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

    public function test_admin_page_renders(): void
    {
        $this->seed();

        $response = $this->get('/admin');

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

        $response = $this->put('/admin/profile', [
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
        $createResponse = $this->post('/admin/projects', [
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

        $updateResponse = $this->put("/admin/projects/{$project->id}", [
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

        $deleteResponse = $this->delete("/admin/projects/{$project->id}");
        $deleteResponse->assertRedirect();
        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }
}
