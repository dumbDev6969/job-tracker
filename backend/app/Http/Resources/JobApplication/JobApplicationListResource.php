<?php

namespace App\Http\Resources\JobApplication;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobApplicationListResource extends JsonResource
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
            'referral' => $this->referral,
        ];
    }
}
