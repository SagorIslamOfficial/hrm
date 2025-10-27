<?php

namespace App\Modules\Employee\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeNoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'note' => ['required', 'string'],
            'is_private' => ['boolean'],
            'category' => ['nullable', 'string', 'in:general,performance,disciplinary,achievement,other'],
        ];
    }

    public function messages(): array
    {
        return [
            'note.required' => 'The note field is required.',
            'category.in' => 'The selected category is invalid.',
        ];
    }
}
