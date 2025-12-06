<?php

namespace App\Http\Requests\User;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LinkEmployeeRequest extends FormRequest
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
        $user = $this->route('user');

        return [
            'employee_id' => [
                'required',
                'uuid',
                'exists:employees,id',
                Rule::unique(User::class, 'employee_id')->ignore($user?->id),
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'employee_id.required' => 'Please select an employee to link.',
            'employee_id.exists' => 'The selected employee does not exist.',
            'employee_id.unique' => 'This employee is already linked to another user account.',
        ];
    }
}
