<?php

namespace App\Modules\Employee\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class UpdateEmploymentTypeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Add authorization logic as needed
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $employmentTypeId = $this->route('employmentType')->id;

        return [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|regex:/^[a-z_]+$/|unique:employment_types,code,'.$employmentTypeId,
            'description' => 'nullable|string|max:1000',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Employment type name is required.',
            'code.required' => 'Employment type code is required.',
            'code.unique' => 'This employment type code is already taken.',
            'code.regex' => 'Code must contain only lowercase letters and underscores.',
        ];
    }
}
