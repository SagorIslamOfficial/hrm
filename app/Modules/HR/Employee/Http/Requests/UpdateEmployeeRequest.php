<?php

namespace App\Modules\HR\Employee\Http\Requests;

use App\Modules\HR\Employee\Models\EmploymentType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeRequest extends FormRequest
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
        $employeeId = $this->route('employee');

        // Get valid employment type codes from database
        $validEmploymentTypes = EmploymentType::where('is_active', true)
            ->pluck('code')
            ->implode(',');

        return [
            // Basic employee fields
            'employee_code' => 'sometimes|string|unique:employees,employee_code,'.$employeeId.'|max:20',
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:employees,email,'.$employeeId.'|max:255',
            'phone' => 'nullable|string|max:20',
            'photo' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:5120|dimensions:min_width=100,min_height=100,max_width=2000,max_height=2000',
            'delete_photo' => 'nullable|boolean',
            'department_id' => 'sometimes|uuid|exists:departments,id',
            'designation_id' => 'sometimes|uuid|exists:designations,id',
            'employment_status' => 'sometimes|in:active,inactive,terminated,on_leave',
            'employment_type' => 'sometimes|in:'.$validEmploymentTypes,
            'joining_date' => 'sometimes|date|before_or_equal:today',
            'currency' => 'sometimes|string|size:3',

            // Personal details
            'personal_detail.date_of_birth' => 'nullable|date|before:today',
            'personal_detail.gender' => 'nullable|in:male,female,other',
            'personal_detail.marital_status' => 'nullable|in:single,married,divorced,widowed',
            'personal_detail.blood_group' => 'nullable|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'personal_detail.national_id' => 'nullable|string|max:50',
            'personal_detail.passport_number' => 'nullable|string|max:50',
            'personal_detail.address' => 'nullable|string',
            'personal_detail.city' => 'nullable|string|max:100',
            'personal_detail.country' => 'nullable|string|max:100',

            // Job details
            'job_detail.job_title' => 'nullable|string|max:255',
            'job_detail.employment_type' => 'nullable|in:'.$validEmploymentTypes,
            'job_detail.supervisor_id' => 'nullable|uuid|exists:employees,id',
            'job_detail.branch_id' => 'nullable|uuid|exists:branches,id',
            'job_detail.work_shift' => 'nullable|in:day,night,rotating,flexible',
            'job_detail.probation_end_date' => 'nullable|date|after:today',
            'job_detail.contract_end_date' => 'nullable|date|after:today',

            // Salary details
            'salary_detail.basic_salary' => 'nullable|numeric|min:0',
            'salary_detail.allowances' => 'nullable|numeric|min:0',
            'salary_detail.deductions' => 'nullable|numeric|min:0',
            'salary_detail.net_salary' => 'nullable|numeric|min:0',
            'salary_detail.bank_name' => 'nullable|string|max:255',
            'salary_detail.bank_account_number' => 'nullable|string|max:50',
            'salary_detail.bank_branch' => 'nullable|string|max:255',
            'salary_detail.tax_id' => 'nullable|string|max:50',
        ];
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'employee_code.unique' => 'This employee code is already taken.',
            'department_id.exists' => 'Selected department does not exist.',
            'designation_id.exists' => 'Selected designation does not exist.',
            'employment_status.in' => 'Invalid employment status.',
            'employment_type.in' => 'Invalid employment type.',
            'personal_detail.date_of_birth.before' => 'Date of birth must be in the past.',
            'personal_detail.gender.in' => 'Invalid gender selection.',
            'personal_detail.marital_status.in' => 'Invalid marital status.',
            'personal_detail.blood_group.in' => 'Invalid blood group.',
            'job_detail.supervisor_id.exists' => 'Selected supervisor does not exist.',
            'job_detail.work_shift.in' => 'Invalid work shift.',
            'salary_detail.basic_salary.min' => 'Basic salary must be a positive number.',
            'salary_detail.allowances.min' => 'Allowances must be a positive number.',
            'salary_detail.deductions.min' => 'Deductions must be a positive number.',
            'photo.image' => 'The uploaded file must be a valid image.',
            'photo.mimes' => 'Photo must be a JPEG, JPG, PNG, GIF, or WebP file.',
            'photo.max' => 'Photo must not exceed 5MB in size.',
            'photo.dimensions' => 'Photo must be between 100x100 and 2000x2000 pixels.',
        ];
    }
}
