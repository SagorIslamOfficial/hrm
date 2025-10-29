<?php

namespace App\Modules\Employee\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeCustomFieldRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'field_key' => [
                'sometimes',
                'string',
                'max:255',
                'regex:/^[a-z0-9-_]+$/',
            ],
            'field_value' => ['nullable', 'string'],
            'field_type' => ['sometimes', 'in:text,number,date,boolean,select,textarea,email,phone,url'],
            'section' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'field_key.regex' => 'The field key must only contain lowercase letters, numbers, hyphens, and underscores.',
            'field_type.in' => 'The field type must be one of: text, number, date, boolean, select, textarea, email, phone, url.',
        ];
    }
}
