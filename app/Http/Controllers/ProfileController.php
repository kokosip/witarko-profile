<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\Project;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function show(): Response
    {
        $profile = Profile::query()->first();

        $projects = Project::query()
            ->where('status', '!=', 'archived')
            ->orderByDesc('is_featured')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return Inertia::render('Home', [
            'profile' => $profile,
            'projects' => $projects,
        ]);
    }
}
