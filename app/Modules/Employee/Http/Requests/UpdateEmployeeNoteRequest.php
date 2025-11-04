<?php

namespace App\Modules\Employee\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeNoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'note' => ['required', 'string'],
            'is_private' => ['boolean'],
            'category' => ['nullable', 'string', 'in:general,performance,disciplinary,achievement,other'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'The title field is required.',
            'title.max' => 'The title may not be greater than 255 characters.',
            'note.required' => 'The note field is required.',
            'category.in' => 'The selected category is invalid.',
        ];
    }
}
