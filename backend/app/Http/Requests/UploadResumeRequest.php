<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UploadResumeRequest extends FormRequest
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
            'resume' => [
                'required',
                'file',
                'max:5120', // 5MB in kilobytes
                'mimes:pdf,doc,docx,odt,rtf',
            ],
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'resume.required' => 'Please select a resume file to upload.',
            'resume.file' => 'The uploaded file is invalid.',
            'resume.max' => 'The resume file may not be greater than 5MB.',
            'resume.mimes' => 'The resume must be a file of type: PDF, DOC, DOCX, ODT, RTF.',
        ];
    }
}
