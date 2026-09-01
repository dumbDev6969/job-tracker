<?php

namespace App\Http\Resources\Profile;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'full_name' => $this->user?->name ?? '',
            'headline' => $this->headline ?? '',
            'location' => $this->location ?? '',
            'phone' => $this->phone ?? '',
            'bio' => $this->bio ?? '',
            'status' => $this->status ?? 'actively_looking',
            'target_roles' => $this->target_roles ?? [],
            'workplace_types' => $this->workplace_types ?? [],
            'employment_types' => $this->employment_types ?? [],
            'target_salary' => $this->target_salary ?? '',
            'portfolio_url' => $this->portfolio_url ?? '',
            'github_url' => $this->github_url ?? '',
            'linkedin_url' => $this->linkedin_url ?? '',
            'custom_links' => $this->custom_links ?? [],
            'resume_file_name' => $this->resume_file_name ?? '',
            'resume_file_size' => $this->formatFileSize($this->resume_file_size_bytes),
            'resume_updated_at' => $this->resume_uploaded_at?->format('M Y') ?? '',
            'resume_url' => !empty($this->resume_path) ? url('/api/profile/resume/download') : null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    private function formatFileSize(?int $bytes): string
    {
        if ($bytes === null || $bytes === 0) {
            return '';
        }

        if ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 1) . ' MB';
        }

        return max(1, (int) round($bytes / 1024)) . ' KB';
    }
}
