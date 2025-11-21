<?php

namespace App\Modules\HR\Organization\Branch\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBranchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Basic Information
            'name' => 'required|string|max:255|unique:branches,name',
            'code' => 'required|string|max:20|unique:branches,code',
            'type' => [
                'required',
                Rule::in([
                    'head_office',
                    'regional_office',
                    'branch_office',
                    'sub_branch',
                    'warehouse',
                    'sales_office',
                    'service_center',
                    'others',
                ]),
            ],
            'description' => 'nullable|string',
            'parent_id' => [
                'nullable',
                'exists:branches,id',
                function ($attribute, $value, $fail) {
                    // Prevent self-reference (only applicable in updates)
                    if ($value && request()->route('branch') === $value) {
                        $fail('A branch cannot be its own parent.');
                    }
                },
            ],
            'manager_id' => 'nullable|exists:employees,id',
            'address_line_1' => 'nullable|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'timezone' => 'nullable|string|timezone|max:50',
            'phone' => 'nullable|string|max:20',
            'phone_2' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255|unique:branches,email',
            'opening_date' => 'nullable|date',
            'is_active' => 'sometimes|boolean',
            'status' => 'required|in:active,inactive,under_construction,closed',
            'max_employees' => 'nullable|integer|min:0',
            'budget' => 'nullable|numeric|min:0',
            'cost_center' => 'nullable|string|max:50',
            'tax_registration_number' => 'nullable|string|max:100',

            // Details (nested)
            'detail' => 'nullable|array',
            'detail.latitude' => 'nullable|numeric|between:-90,90',
            'detail.longitude' => 'nullable|numeric|between:-180,180',
            'detail.working_hours' => 'nullable|array',
            'detail.facilities' => 'nullable|array',
            'detail.total_area' => 'nullable|numeric|min:0',
            'detail.total_floors' => 'nullable|integer|min:0',
            'detail.floor_number' => 'nullable|string|max:100',
            'detail.accessibility_features' => 'nullable|string',
            'detail.monthly_rent' => 'nullable|numeric|min:0',
            'detail.monthly_utilities' => 'nullable|numeric|min:0',
            'detail.monthly_maintenance' => 'nullable|numeric|min:0',
            'detail.security_deposit' => 'nullable|numeric|min:0',
            'detail.building_name' => 'nullable|string|max:255',
            'detail.building_type' => 'nullable|string|max:20',
            'detail.lease_start_date' => 'nullable|date',
            'detail.lease_end_date' => 'nullable|date|after:detail.lease_start_date',
            'detail.lease_terms' => 'nullable|string',
            'detail.property_contact_name' => 'nullable|string|max:255',
            'detail.property_contact_phone' => 'nullable|string|max:20',
            'detail.property_contact_email' => 'nullable|email|max:255',
            'detail.property_contact_address' => 'nullable|string|max:500',

            // Photo fields (direct, not nested)
            'property_contact_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'delete_property_contact_photo' => 'sometimes|boolean',

            // Settings (nested)
            'settings' => 'nullable|array',
            'settings.allow_overtime' => 'sometimes|boolean',
            'settings.overtime_rate' => 'nullable|numeric|min:1',
            'settings.allow_remote_work' => 'sometimes|boolean',
            'settings.remote_work_days_per_week' => 'nullable|integer|min:0|max:7',
            'settings.standard_work_start' => 'nullable|date_format:H:i',
            'settings.standard_work_end' => 'nullable|date_format:H:i',
            'settings.standard_work_hours' => 'nullable|integer|min:0|max:24',
            'settings.leave_policies' => 'nullable|array',
            'settings.approval_hierarchy' => 'nullable|array',
            'settings.security_features' => 'nullable|array',
            'settings.security_features.*.name' => 'required_with:settings.security_features|string|max:255',
            'settings.currency' => 'nullable|string|max:3',
            'settings.payment_method' => 'nullable|string|max:50',
            'settings.salary_payment_day' => 'nullable|integer|min:1|max:31',
            'settings.primary_language' => 'nullable|string|max:10',
            'settings.supported_languages' => 'nullable|array',
            'settings.emergency_contact_name' => 'nullable|string|max:255',
            'settings.emergency_contact_phone' => 'nullable|string|max:20',
            'settings.nearest_hospital' => 'nullable|string|max:255',
            'settings.nearest_police_station' => 'nullable|string|max:255',
            'settings.custom_settings' => 'nullable|array',

            // Departments (many-to-many)
            'departments' => 'nullable|array',
            'departments.*.department_id' => 'required|exists:departments,id',
            'departments.*.budget_allocation' => 'nullable|numeric|min:0',
            'departments.*.is_primary' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Branch name is required.',
            'name.unique' => 'This branch name already exists.',
            'code.required' => 'Branch code is required.',
            'code.unique' => 'This branch code already exists.',
            'type.required' => 'Branch type is required.',
            'parent_id.exists' => 'Selected parent branch does not exist.',
            'manager_id.exists' => 'Selected manager does not exist.',
            'email.email' => 'Please provide a valid email address.',
            'detail.lease_end_date.after' => 'Lease end date must be after start date.',
        ];
    }
}
