<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        'full_name',
        'headline',
        'location',
        'email',
        'phone',
        'summary',
        'quote',
        'github_url',
        'linkedin_url',
        'website_url',
        'avatar_url',
        'skills',
        'experiences',
        'educations',
    ];

    protected function casts(): array
    {
        return [
            'skills' => 'array',
            'experiences' => 'array',
            'educations' => 'array',
        ];
    }
}
