<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class Profile extends Model
{
    /** @use HasFactory<\Database\Factories\ProfileFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'headline',
        'location',
        'phone',
        'bio',
        'status',
        'target_roles',
        'workplace_types',
        'employment_types',
        'target_salary',
        'portfolio_url',
        'github_url',
        'linkedin_url',
        'custom_links',
        'resume_path',
        'resume_file_name',
        'resume_file_size',
        'resume_updated_at',
    ];

    protected function casts(): array
    {
        return [
            'target_roles' => 'array',
            'workplace_types' => 'array',
            'employment_types' => 'array',
            'custom_links' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
