<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateJobApplicationRequest extends FormRequest
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
            'company' => ['sometimes', 'required', 'string', 'max:255'],
            'role' => ['sometimes', 'required', 'string', 'max:255'],
            'status' => ['sometimes', 'required', 'string', 'in:saved,applied,interviewing,offered,rejected'],
            'applied_date' => ['nullable', 'date'],
            'url' => ['nullable', 'url'],
            'contact' => ['nullable', 'string', 'max:255'],
            'referral' => ['nullable', 'boolean'],
            'notes' => ['nullable', 'string'],
            'follow_up_date' => ['nullable', 'date'],
            'interview_date' => ['nullable', 'date'],
        ];
    }
}
