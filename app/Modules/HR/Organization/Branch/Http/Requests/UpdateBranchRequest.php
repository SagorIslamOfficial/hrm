<?php

namespace App\Modules\HR\Organization\Branch\Http\Requests;

use App\Modules\HR\Organization\Branch\Models\BranchCustomField;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBranchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $branchId = request()->route('branch');

        return [
            // Basic Information
            'name' => 'sometimes|string|max:255|unique:branches,name,'.$branchId,
            'code' => 'sometimes|string|max:20|unique:branches,code,'.$branchId,
            'type' => [
                'sometimes',
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
                function ($attribute, $value, $fail) use ($branchId) {
                    // Prevent self-reference
                    if ($value === $branchId) {
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
            'email' => 'nullable|email|max:255|unique:branches,email,'.$branchId,
            'opening_date' => 'nullable|date',
            'is_active' => 'sometimes|boolean',
            'status' => 'sometimes|in:active,inactive,under_construction,closed',
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
            'settings.standard_work_start' => 'nullable|string|max:20',
            'settings.standard_work_end' => 'nullable|string|max:20',
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

            // Notes - optional since processed separately
            'notes' => 'sometimes|nullable|array',
            'notes.*.id' => 'required_with:notes|string',
            'notes.*.title' => 'string|max:255',
            'notes.*.note' => 'required_with:notes|string',
            'notes.*.category' => 'required_with:notes|in:general,financial,operational,facilities',
            'notes.*.is_private' => 'sometimes|boolean',
            'notes.*.created_at' => 'sometimes|date',
            'notes.*._isNew' => 'sometimes|boolean',
            'notes.*._isModified' => 'sometimes|boolean',
            'notes.*._isDeleted' => 'sometimes|boolean',

            // Departments (many-to-many) - optional since processed separately
            'departments' => 'sometimes|nullable|array',
            'departments.*.department_id' => 'required_with:departments|exists:departments,id',
            'departments.*.budget_allocation' => 'nullable|numeric|min:0',
            'departments.*.is_primary' => 'nullable|boolean',

            // Documents - for branch document endpoints
            'doc_type' => 'sometimes|in:license,contract,permit,certificate,report',
            'title' => 'sometimes|string|max:255',
            'file' => 'sometimes|file|mimes:pdf,doc,docx,jpg,jpeg,png,webp,xlsx,xls,zip|max:10240',
            'expiry_date' => 'nullable|date|after:today',

            // Custom Fields (for sync endpoint) - optional since processed separately
            'custom_fields' => 'sometimes|nullable|array',
            'custom_fields.*.field_key' => 'required_with:custom_fields|string|regex:/^[a-z0-9-_]+$/|max:255',
            'custom_fields.*.field_value' => 'nullable|string|max:255',
            'custom_fields.*.field_type' => 'required_with:custom_fields|in:text,number,date,boolean,select,textarea,email,phone,url',
            'custom_fields.*.section' => 'nullable|string|in:general,operational,technical,other',

            // Single Custom Field - for create/update custom field
            'branch_id' => 'sometimes|uuid|exists:branches,id',
            'field_key' => [
                'sometimes',
                'string',
                'regex:/^[a-z0-9-_]+$/',
                'max:255',
                function ($attribute, $value, $fail) {
                    if (request()->has('branch_id')) {
                        $exists = BranchCustomField::where('branch_id', request('branch_id'))
                            ->where('field_key', $value)
                            ->when(request()->route('customField'), function ($query) {
                                return $query->where('id', '!=', request()->route('customField'));
                            })
                            ->exists();
                        if ($exists) {
                            $fail('The field key has already been taken for this branch.');
                        }
                    }
                },
            ],
            'field_value' => 'sometimes|string|max:255',
            'field_type' => 'sometimes|in:text,number,date,boolean,select,textarea,email,phone,url',
            'section' => 'nullable|string|in:general,operational,technical,other',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Validate time formats
            $timeFields = ['settings.standard_work_start', 'settings.standard_work_end'];

            foreach ($timeFields as $field) {
                $value = $this->input($field);

                if ($value && ! $this->isValidTimeFormat($value)) {
                    $fieldName = str_replace('settings.', '', str_replace('_', ' ', $field));
                    $validator->errors()->add($field, "The {$fieldName} must be in HH:MM (24-hour) or H:MM AM/PM (12-hour) format.");
                }
            }
        });
    }

    private function isValidTimeFormat(string $time): bool
    {
        // Regex pattern for time validation
        $pattern = '/^((([01]?\d|2[0-3]):[0-5]\d(:[0-5]\d)?)|(([1-9]|1[0-2]):[0-5]\d(:[0-5]\d)?\s*(AM|PM)))$/i';

        return preg_match($pattern, $time) === 1;
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Branch name is required.',
            'name.string' => 'Branch name must be a valid string.',
            'name.max' => 'Branch name cannot exceed 255 characters.',
            'name.unique' => 'This branch name already exists.',

            'code.required' => 'Branch code is required.',
            'code.string' => 'Branch code must be a valid string.',
            'code.max' => 'Branch code cannot exceed 20 characters.',
            'code.unique' => 'This branch code already exists.',

            'type.required' => 'Branch type is required.',
            'type.in' => 'Please select a valid branch type (head office, regional office, branch office, sub branch, warehouse, sales office, service center, or other).',

            'description.string' => 'Description must be a valid string.',

            // Hierarchy
            'parent_id.exists' => 'Selected parent branch does not exist.',

            // Manager
            'manager_id.exists' => 'Selected manager does not exist.',

            // Location
            'address_line_1.string' => 'Address line 1 must be a valid string.',
            'address_line_1.max' => 'Address line 1 cannot exceed 255 characters.',

            'address_line_2.string' => 'Address line 2 must be a valid string.',
            'address_line_2.max' => 'Address line 2 cannot exceed 255 characters.',

            'city.string' => 'City must be a valid string.',
            'city.max' => 'City cannot exceed 100 characters.',

            'state.string' => 'State must be a valid string.',
            'state.max' => 'State cannot exceed 100 characters.',

            'country.string' => 'Country must be a valid string.',
            'country.max' => 'Country cannot exceed 100 characters.',

            'postal_code.string' => 'Postal code must be a valid string.',
            'postal_code.max' => 'Postal code cannot exceed 20 characters.',

            'timezone.string' => 'Timezone must be a valid string.',
            'timezone.timezone' => 'Please select a valid timezone.',
            'timezone.max' => 'Timezone cannot exceed 50 characters.',

            // Contact
            'phone.string' => 'Phone number must be a valid string.',
            'phone.max' => 'Phone number cannot exceed 20 characters.',

            'phone_2.string' => 'Secondary phone number must be a valid string.',
            'phone_2.max' => 'Secondary phone number cannot exceed 20 characters.',

            'email.email' => 'Please provide a valid email address.',
            'email.max' => 'Email cannot exceed 255 characters.',

            // Operational
            'opening_date.date' => 'Opening date must be a valid date.',

            'is_active.required' => 'Active status is required.',
            'is_active.boolean' => 'Active status must be true or false.',

            'status.required' => 'Branch status is required.',
            'status.in' => 'Please select a valid branch status (active, inactive, under_construction, or closed).',

            'max_employees.integer' => 'Maximum employees must be a valid number.',
            'max_employees.min' => 'Maximum employees cannot be negative.',

            'budget.numeric' => 'Budget must be a valid number.',
            'budget.min' => 'Budget cannot be negative.',

            'cost_center.string' => 'Cost center must be a valid string.',
            'cost_center.max' => 'Cost center cannot exceed 50 characters.',

            'tax_registration_number.string' => 'Tax registration number must be a valid string.',
            'tax_registration_number.max' => 'Tax registration number cannot exceed 100 characters.',

            // Details (nested)
            'detail.array' => 'Branch details must be a valid array.',

            'detail.latitude.numeric' => 'Latitude must be a valid number.',
            'detail.latitude.between' => 'Latitude must be between -90 and 90.',

            'detail.longitude.numeric' => 'Longitude must be a valid number.',
            'detail.longitude.between' => 'Longitude must be between -180 and 180.',

            'detail.working_hours.array' => 'Working hours must be a valid array.',

            'detail.facilities.array' => 'Facilities must be a valid array.',

            'detail.total_area.numeric' => 'Total area must be a valid number.',
            'detail.total_area.min' => 'Total area cannot be negative.',

            'detail.total_floors.integer' => 'Total floors must be a valid number.',
            'detail.total_floors.min' => 'Total floors cannot be negative.',

            'detail.floor_number.string' => 'Floor number must be a valid string.',
            'detail.floor_number.max' => 'Floor number cannot exceed 100 characters.',

            'detail.accessibility_features.string' => 'Accessibility features must be a valid string.',

            'detail.monthly_rent.numeric' => 'Monthly rent must be a valid number.',
            'detail.monthly_rent.min' => 'Monthly rent cannot be negative.',

            'detail.monthly_utilities.numeric' => 'Monthly utilities must be a valid number.',
            'detail.monthly_utilities.min' => 'Monthly utilities cannot be negative.',

            'detail.monthly_maintenance.numeric' => 'Monthly maintenance must be a valid number.',
            'detail.monthly_maintenance.min' => 'Monthly maintenance cannot be negative.',

            'detail.security_deposit.numeric' => 'Security deposit must be a valid number.',
            'detail.security_deposit.min' => 'Security deposit cannot be negative.',

            'detail.building_name.string' => 'Building name must be a valid string.',
            'detail.building_name.max' => 'Building name cannot exceed 255 characters.',

            'detail.building_type.string' => 'Building type must be a valid string.',
            'detail.building_type.max' => 'Building type cannot exceed 20 characters.',

            'detail.lease_start_date.date' => 'Lease start date must be a valid date.',

            'detail.lease_end_date.date' => 'Lease end date must be a valid date.',
            'detail.lease_end_date.after' => 'Lease end date must be after start date.',

            'detail.lease_terms.string' => 'Lease terms must be a valid string.',

            'detail.property_contact_name.string' => 'Property contact name must be a valid string.',
            'detail.property_contact_name.max' => 'Property contact name cannot exceed 255 characters.',

            'detail.property_contact_phone.string' => 'Property contact phone must be a valid string.',
            'detail.property_contact_phone.max' => 'Property contact phone cannot exceed 20 characters.',

            'detail.property_contact_email.email' => 'Property contact email must be a valid email address.',
            'detail.property_contact_email.max' => 'Property contact email cannot exceed 255 characters.',

            'detail.property_contact_address.string' => 'Property contact address must be a valid string.',
            'detail.property_contact_address.max' => 'Property contact address cannot exceed 500 characters.',

            // Photo fields
            'property_contact_photo.image' => 'Property contact photo must be a valid image file.',
            'property_contact_photo.mimes' => 'Property contact photo must be a JPEG, PNG, JPG, GIF, or WebP file.',
            'property_contact_photo.max' => 'Property contact photo cannot exceed 2MB in size.',

            'delete_property_contact_photo.boolean' => 'Delete photo option must be true or false.',

            // Settings (nested)
            'settings.array' => 'Branch settings must be a valid array.',

            'settings.allow_overtime.required_with' => 'Allow overtime setting is required.',
            'settings.allow_overtime.boolean' => 'Allow overtime must be true or false.',

            'settings.overtime_rate.numeric' => 'Overtime rate must be a valid number.',
            'settings.overtime_rate.min' => 'Overtime rate must be at least 1.',

            'settings.allow_remote_work.required_with' => 'Allow remote work setting is required.',
            'settings.allow_remote_work.boolean' => 'Allow remote work must be true or false.',

            'settings.remote_work_days_per_week.integer' => 'Remote work days per week must be a valid number.',
            'settings.remote_work_days_per_week.min' => 'Remote work days per week cannot be negative.',
            'settings.remote_work_days_per_week.max' => 'Remote work days per week cannot exceed 7.',

            'settings.standard_work_start.string' => 'Standard work start time must be a valid string.',
            'settings.standard_work_start.max' => 'Standard work start time cannot exceed 20 characters.',
            'settings.standard_work_start.regex' => 'Standard work start time must be in HH:MM (24-hour) or H:MM AM/PM (12-hour) format.',

            'settings.standard_work_end.string' => 'Standard work end time must be a valid string.',
            'settings.standard_work_end.max' => 'Standard work end time cannot exceed 20 characters.',
            'settings.standard_work_end.regex' => 'Standard work end time must be in HH:MM (24-hour) or H:MM AM/PM (12-hour) format.',

            'settings.standard_work_hours.integer' => 'Standard work hours must be a valid number.',
            'settings.standard_work_hours.min' => 'Standard work hours cannot be negative.',
            'settings.standard_work_hours.max' => 'Standard work hours cannot exceed 24.',

            'settings.leave_policies.array' => 'Leave policies must be a valid array.',

            'settings.approval_hierarchy.array' => 'Approval hierarchy must be a valid array.',

            'settings.security_features.array' => 'Security features must be a valid array.',
            'settings.security_features.*.name.required_with' => 'Security feature name is required.',
            'settings.security_features.*.name.string' => 'Security feature name must be a valid string.',
            'settings.security_features.*.name.max' => 'Security feature name cannot exceed 255 characters.',

            'settings.currency.string' => 'Currency must be a valid string.',
            'settings.currency.max' => 'Currency cannot exceed 3 characters.',

            'settings.payment_method.string' => 'Payment method must be a valid string.',
            'settings.payment_method.max' => 'Payment method cannot exceed 50 characters.',

            'settings.salary_payment_day.integer' => 'Salary payment day must be a valid number.',
            'settings.salary_payment_day.min' => 'Salary payment day must be between 1 and 31.',
            'settings.salary_payment_day.max' => 'Salary payment day must be between 1 and 31.',

            'settings.primary_language.string' => 'Primary language must be a valid string.',
            'settings.primary_language.max' => 'Primary language cannot exceed 10 characters.',

            'settings.supported_languages.array' => 'Supported languages must be a valid array.',

            'settings.emergency_contact_name.string' => 'Emergency contact name must be a valid string.',
            'settings.emergency_contact_name.max' => 'Emergency contact name cannot exceed 255 characters.',

            'settings.emergency_contact_phone.string' => 'Emergency contact phone must be a valid string.',
            'settings.emergency_contact_phone.max' => 'Emergency contact phone cannot exceed 20 characters.',

            'settings.nearest_hospital.string' => 'Nearest hospital must be a valid string.',
            'settings.nearest_hospital.max' => 'Nearest hospital cannot exceed 255 characters.',

            'settings.nearest_police_station.string' => 'Nearest police station must be a valid string.',
            'settings.nearest_police_station.max' => 'Nearest police station cannot exceed 255 characters.',

            'settings.custom_settings.array' => 'Custom settings must be a valid array.',

            // Notes
            'notes.array' => 'Notes must be a valid array.',
            'notes.*.id.required_with' => 'Note ID is required.',
            'notes.*.id.string' => 'Note ID must be a valid string.',
            'notes.*.title.string' => 'Note title must be a valid string.',
            'notes.*.title.max' => 'Note title cannot exceed 255 characters.',
            'notes.*.note.required_with' => 'Note content is required.',
            'notes.*.note.string' => 'Note content must be a valid string.',
            'notes.*.category.required_with' => 'Note category is required.',
            'notes.*.category.in' => 'Note category must be general, financial, operational, or facilities.',
            'notes.*.is_private.boolean' => 'Note privacy setting must be true or false.',
            'notes.*.created_at.date' => 'Note creation date must be a valid date.',
            'notes.*._isNew.boolean' => 'Note new flag must be true or false.',
            'notes.*._isModified.boolean' => 'Note modified flag must be true or false.',
            'notes.*._isDeleted.boolean' => 'Note deleted flag must be true or false.',

            // Departments
            'departments.array' => 'Departments must be a valid array.',
            'departments.*.department_id.required_with' => 'Department ID is required.',
            'departments.*.department_id.exists' => 'Selected department does not exist.',
            'departments.*.budget_allocation.numeric' => 'Budget allocation must be a valid number.',
            'departments.*.budget_allocation.min' => 'Budget allocation cannot be negative.',
            'departments.*.is_primary.boolean' => 'Primary department flag must be true or false.',

            // Document messages
            'doc_type.in' => 'Document type must be one of: license, contract, permit, certificate, report.',
            'title.string' => 'Document title must be a valid string.',
            'title.max' => 'Document title cannot exceed 255 characters.',
            'file.file' => 'The document file field must be a file.',
            'file.mimes' => 'The document file field must be a file of type: pdf, doc, docx, jpg, jpeg, png, webp, xlsx, xls, zip.',
            'file.max' => 'The document file must not exceed 10MB.',
            'expiry_date.after' => 'Expiry date must be a future date.',

            // Custom Fields
            'custom_fields.array' => 'Custom fields must be a valid array.',
            'custom_fields.*.field_key.required_with' => 'Field key is required for each custom field.',
            'custom_fields.*.field_key.regex' => 'Field key must be in lowercase with hyphens or underscores (e.g., wifi-password).',
            'custom_fields.*.field_key.max' => 'Field key cannot exceed 255 characters.',
            'custom_fields.*.field_value.max' => 'Field value cannot exceed 255 characters.',
            'custom_fields.*.field_type.required_with' => 'Field type is required for each custom field.',
            'custom_fields.*.field_type.in' => 'Field type must be one of: text, number, date, boolean, select, textarea, email, phone, url.',
            'custom_fields.*.section.in' => 'Section must be one of: general, operational, technical, other.',

            // Single custom field messages
            'field_key.regex' => 'Field key must be in lowercase with hyphens or underscores (e.g., wifi-password).',
            'field_value.max' => 'Field value cannot exceed 255 characters.',
            'field_type.in' => 'Field type must be one of: text, number, date, boolean, select, textarea, email, phone, url.',
        ];
    }
}
