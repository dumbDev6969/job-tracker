<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'full_name' => ['nullable', 'string', 'max:255'],
            'headline' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'bio' => ['nullable', 'string', 'max:5000'],
            'status' => ['nullable', 'string', 'in:actively_looking,open_to_offers,not_looking'],
            'target_roles' => ['nullable', 'array'],
            'target_roles.*' => ['string', 'max:100'],
            'workplace_types' => ['nullable', 'array'],
            'workplace_types.*' => ['string', 'max:50'],
            'employment_types' => ['nullable', 'array'],
            'employment_types.*' => ['string', 'max:50'],
            'target_salary' => ['nullable', 'string', 'max:100'],
            'portfolio_url' => ['nullable', 'string', 'max:500'],
            'github_url' => ['nullable', 'string', 'max:500'],
            'linkedin_url' => ['nullable', 'string', 'max:500'],
            'custom_links' => ['nullable', 'array'],
            'custom_links.*.id' => ['nullable', 'string'],
            'custom_links.*.label' => ['nullable', 'string', 'max:100'],
            'custom_links.*.url' => ['nullable', 'string', 'max:500'],
            'resume_file_name' => ['nullable', 'string', 'max:255'],
            'resume_file_size' => ['nullable', 'string', 'max:50'],
            'resume_updated_at' => ['nullable', 'string', 'max:50'],
        ];
    }
}
