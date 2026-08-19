<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CalendarEventResource extends JsonResource
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
            'company' => $this->company,
            'role' => $this->role,
            'interview_date' => $this->interview_date,
            'follow_up_date' => $this->follow_up_date,
        ];
    }
}
