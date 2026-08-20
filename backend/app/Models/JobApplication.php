<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class JobApplication extends Model
{
    /** @use HasFactory<\Database\Factories\JobApplicationFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'company',
        'role',
        'status',
        'applied_date',
        'url',
        'contact',
        'referral',
        'notes',
        'follow_up_date',
        'interview_date',
    ];

    protected function casts(): array
    {
        return [
            'applied_date' => 'date',
            'follow_up_date' => 'date',
            'interview_date' => 'date',
            'referral' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
