<?php

namespace App\Modules\Employee\Http\Requests;

use App\Modules\Employee\Models\EmploymentType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeRequest extends FormRequest
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
        // Get valid employment type codes from database
        $validEmploymentTypes = EmploymentType::where('is_active', true)
            ->pluck('code')
            ->implode(',');

        return [
            'employee_code' => 'required|string|unique:employees,employee_code|max:20',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:employees,email|max:255',
            'phone' => 'nullable|string|max:20',
            'photo' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:5120|dimensions:min_width=100,min_height=100,max_width=2000,max_height=2000',
            'department_id' => 'required|uuid|exists:departments,id',
            'designation_id' => 'required|uuid|exists:designations,id',
            'employment_status' => 'required|in:active,inactive,terminated,on_leave',
            'employment_type' => 'required|in:'.$validEmploymentTypes,
            'joining_date' => 'required|date|before_or_equal:today',
            'currency' => 'sometimes|string|size:3',

            // Allow nested data for comprehensive employee creation
            'personal_detail' => 'nullable|array',
            'personal_detail.date_of_birth' => 'nullable|date|before:today',
            'personal_detail.gender' => 'nullable|in:male,female,other',
            'personal_detail.marital_status' => 'nullable|in:single,married,divorced,widowed',

            'job_detail' => 'nullable|array',
            'job_detail.job_title' => 'nullable|string|max:255',
            'job_detail.employment_type' => 'nullable|in:'.$validEmploymentTypes,

            'salary_detail' => 'nullable|array',
            'salary_detail.basic_salary' => 'nullable|numeric|min:0',
            'salary_detail.allowances' => 'nullable|numeric|min:0',
        ];
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'employee_code.required' => 'Employee code is required.',
            'employee_code.unique' => 'This employee code is already taken.',
            'department_id.required' => 'Please select a department.',
            'department_id.exists' => 'Selected department does not exist.',
            'designation_id.required' => 'Please select a designation.',
            'designation_id.exists' => 'Selected designation does not exist.',
            'employment_status.in' => 'Invalid employment status.',
            'employment_type.in' => 'Invalid employment type.',
            'joining_date.before_or_equal' => 'Joining date cannot be in the future.',
            'photo.image' => 'The uploaded file must be a valid image.',
            'photo.mimes' => 'Photo must be a JPEG, JPG, PNG, GIF, or WebP file.',
            'photo.max' => 'Photo must not exceed 5MB in size.',
            'photo.dimensions' => 'Photo must be between 100x100 and 2000x2000 pixels.',
        ];
    }
}
