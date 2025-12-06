<?php

namespace App\Http\Requests\User;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled by policy
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<string>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'password' => ['nullable', 'string', Password::defaults()],
            'role' => ['required', 'string', 'exists:roles,name'],
            'employee_id' => [
                'nullable',
                'uuid',
                'exists:employees,id',
                Rule::unique(User::class, 'employee_id'),
            ],
            'status' => ['required', 'string', 'in:active,inactive,terminated,on_leave'],
            'send_credentials' => ['boolean'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'employee_id.unique' => 'This employee is already linked to another user account.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'send_credentials' => $this->boolean('send_credentials', true),
        ]);
    }
}
