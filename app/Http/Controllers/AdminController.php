<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function index(): Response
    {
        $profile = Profile::query()->first();

        $projects = Project::query()
            ->orderByDesc('is_featured')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return Inertia::render('Admin', [
            'profile' => $profile,
            'projects' => $projects,
        ]);
    }

    public function updateProfile(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:150'],
            'headline' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:150'],
            'email' => ['nullable', 'email', 'max:150'],
            'phone' => ['nullable', 'string', 'max:50'],
            'summary' => ['nullable', 'string', 'max:3000'],
            'quote' => ['nullable', 'string', 'max:500'],
            'github_url' => ['nullable', 'url', 'max:255'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'website_url' => ['nullable', 'url', 'max:255'],
            'avatar_url' => ['nullable', 'string', 'max:500'],
            'avatar_file' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'remove_avatar' => ['nullable', 'boolean'],
            'skills' => ['nullable', 'array'],
            'skills.*' => ['string', 'max:80'],
            'experiences' => ['nullable', 'array'],
            'experiences.*.id' => ['required', 'string', 'max:64'],
            'experiences.*.role' => ['required', 'string', 'max:150'],
            'experiences.*.company' => ['required', 'string', 'max:150'],
            'experiences.*.period' => ['nullable', 'string', 'max:100'],
            'experiences.*.location' => ['nullable', 'string', 'max:120'],
            'experiences.*.description' => ['nullable', 'string', 'max:2000'],
            'educations' => ['nullable', 'array'],
            'educations.*.id' => ['required', 'string', 'max:64'],
            'educations.*.institution' => ['required', 'string', 'max:180'],
            'educations.*.degree' => ['nullable', 'string', 'max:180'],
            'educations.*.period' => ['nullable', 'string', 'max:100'],
            'educations.*.description' => ['nullable', 'string', 'max:1000'],
        ]);

        $profile = Profile::query()->first();

        unset($validated['avatar_file'], $validated['remove_avatar']);

        if ($request->boolean('remove_avatar')) {
            $this->deleteLocalAvatar($profile?->avatar_url);
            $validated['avatar_url'] = null;
        } elseif ($request->hasFile('avatar_file')) {
            $this->deleteLocalAvatar($profile?->avatar_url);
            $path = $request->file('avatar_file')->store('avatars', 'public');
            $validated['avatar_url'] = '/storage/'.$path;
        }

        if ($profile) {
            $profile->update($validated);
        } else {
            Profile::query()->create($validated);
        }

        return back()->with('success', 'Profil berhasil diperbarui.');
    }

    private function deleteLocalAvatar(?string $avatarUrl): void
    {
        if (! $avatarUrl || ! str_starts_with($avatarUrl, '/storage/avatars/')) {
            return;
        }

        $relativePath = Str::after($avatarUrl, '/storage/');
        Storage::disk('public')->delete($relativePath);
    }

    public function storeProject(Request $request): RedirectResponse
    {
        $validated = $this->validateProject($request);
        $validated['slug'] = $this->uniqueSlug($validated['title']);

        Project::query()->create($validated);

        return back()->with('success', 'Project baru berhasil ditambahkan.');
    }

    public function updateProject(Request $request, Project $project): RedirectResponse
    {
        $validated = $this->validateProject($request, $project->id);

        if ($project->title !== $validated['title']) {
            $validated['slug'] = $this->uniqueSlug($validated['title'], $project->id);
        }

        $project->update($validated);

        return back()->with('success', 'Project berhasil diperbarui.');
    }

    public function destroyProject(Project $project): RedirectResponse
    {
        $project->delete();

        return back()->with('success', 'Project berhasil dihapus.');
    }

    /**
     * Validate project input fields consistently across store and update.
     *
     * @return array<string, mixed>
     */
    private function validateProject(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:2000'],
            'subdomain_url' => ['nullable', 'url', 'max:255'],
            'github_url' => ['nullable', 'url', 'max:255'],
            'tech_stack' => ['nullable', 'array'],
            'tech_stack.*' => ['string', 'max:60'],
            'status' => ['required', Rule::in(['published', 'coming_soon', 'archived'])],
            'is_featured' => ['boolean'],
            'sort_order' => ['integer', 'min:0', 'max:9999'],
        ]);
    }

    private function uniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title) ?: 'project';
        $slug = $base;
        $counter = 2;

        while (
            Project::query()
                ->where('slug', $slug)
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = "{$base}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
