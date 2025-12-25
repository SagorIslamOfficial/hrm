<?php

namespace App\Modules\HR\Organization\Complaint\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class StoreComplaintRequest extends FormRequest
{
    // Determine if the user is authorized to make this request.
    public function authorize(): bool
    {
        return true; // Authorization handled by policy
    }

    // Prepare the data for validation.
    protected function prepareForValidation(): void
    {
        $this->merge([
            'employee_id' => Auth::user()->employee->id ?? null,
        ]);
    }

    // Get the validation rules that apply to the request.
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:100'],
            'categories' => ['required', 'array', 'min:1'],
            'categories.*' => ['string', 'max:50'],
            'employee_id' => Rule::requiredIf(fn () => ! Auth::user()->employee),
            'incident_date' => ['required', 'date', 'before_or_equal:today'],
            'incident_location' => ['nullable', 'string', 'max:50'],
            'brief_description' => ['required', 'string', 'max:1500'],
            'assigned_to' => ['required', 'uuid', 'exists:users,id'],
            'is_anonymous' => ['boolean'],
            'is_confidential' => ['boolean'],
            'is_recurring' => ['boolean'],
        ];
    }

    // Get custom messages for validator errors.
    public function messages(): array
    {
        return [
            'title.required' => 'A complaint title is required.',
            'categories.required' => 'At least one category is required.',
            'categories.min' => 'At least one category is required.',
            'brief_description.required' => 'A brief description of the complaint is required.',
            'incident_date.required' => 'The incident date is required.',
            'incident_date.before_or_equal' => 'The incident date cannot be in the future.',
            'assigned_to.required' => 'The assigned user is required.',
            'employee_id.required' => 'You must have an employee profile to file a complaint. Please contact HR.',
        ];
    }
}
