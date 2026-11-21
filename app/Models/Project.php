<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'subdomain_url',
        'github_url',
        'tech_stack',
        'status',
        'is_featured',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'tech_stack' => 'array',
            'is_featured' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
