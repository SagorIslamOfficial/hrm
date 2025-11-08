<?php

namespace App\Modules\HR\Employee\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeDocumentRequest extends FormRequest
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
        $validDocTypes = implode(',', array_keys(config('employee.document_types')));

        return [
            'doc_type' => 'sometimes|required|string|in:'.$validDocTypes,
            'title' => 'sometimes|required|string|max:255',
            'file' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240',
            'expiry_date' => 'nullable|date|after:today',
        ];
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'doc_type.required' => 'Document type is required.',
            'doc_type.in' => 'Invalid document type selected.',
            'title.required' => 'Document title is required.',
            'title.max' => 'Document title must not exceed 255 characters.',
            'file.file' => 'The uploaded file is invalid.',
            'file.mimes' => 'File must be a PDF, DOC, DOCX, JPG, JPEG, or PNG.',
            'file.max' => 'File must not exceed 10MB in size.',
            'expiry_date.date' => 'Please provide a valid expiry date.',
            'expiry_date.after' => 'Expiry date must be a future date.',
        ];
    }
}
