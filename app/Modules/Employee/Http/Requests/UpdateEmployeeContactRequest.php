<?php

namespace App\Modules\Employee\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class UpdateEmployeeContactRequest extends FormRequest
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
            'contact_name' => 'required|string|max:255',
            'relationship' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:500',
            'photo' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048|dimensions:min_width=100,min_height=100,max_width=1000,max_height=1000',
            'is_primary' => 'nullable|boolean',
        ];
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'contact_name.required' => 'Contact name is required.',
            'contact_name.max' => 'Contact name must not exceed 255 characters.',
            'relationship.required' => 'Relationship is required.',
            'relationship.max' => 'Relationship must not exceed 100 characters.',
            'phone.required' => 'Phone number is required.',
            'phone.max' => 'Phone number must not exceed 20 characters.',
            'email.email' => 'Please provide a valid email address.',
            'email.max' => 'Email must not exceed 255 characters.',
            'address.max' => 'Address must not exceed 500 characters.',
            'photo.image' => 'The uploaded file must be a valid image.',
            'photo.mimes' => 'Photo must be a JPEG, JPG, PNG, GIF, or WebP file.',
            'photo.max' => 'Photo must not exceed 2MB in size.',
            'photo.dimensions' => 'Photo must be between 100x100 and 1000x1000 pixels.',
            'is_primary.boolean' => 'Primary contact field must be true or false.',
        ];
    }
}
