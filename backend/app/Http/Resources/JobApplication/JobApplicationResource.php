<?php

namespace App\Http\Resources\JobApplication;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobApplicationResource extends JsonResource
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
            'company' => $this->company,
            'role' => $this->role,
            'status' => $this->status,
            'applied_date' => $this->applied_date,
            'url' => $this->url,
            'contact' => $this->contact,
            'referral' => $this->referral,
            'notes' => $this->notes,
            'follow_up_date' => $this->follow_up_date,
            'interview_date' => $this->interview_date,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
