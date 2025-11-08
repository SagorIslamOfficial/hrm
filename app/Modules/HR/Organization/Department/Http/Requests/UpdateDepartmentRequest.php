<?php

namespace App\Modules\HR\Organization\Department\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDepartmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $departmentId = request()->route('department');

        return [
            // Department
            'name' => 'sometimes|string|max:255|unique:departments,name,'.$departmentId,
            'code' => 'sometimes|string|max:10|unique:departments,code,'.$departmentId,
            'description' => 'nullable|string',
            'manager_id' => 'nullable|exists:employees,id',
            'budget' => 'nullable|numeric|min:0',
            'location' => 'nullable|string|max:255',
            'status' => 'sometimes|in:active,inactive,archived',

            // Details
            'detail.founded_date' => 'nullable|date',
            'detail.division' => 'nullable|string|max:255',
            'detail.cost_center' => 'nullable|string|max:50',
            'detail.internal_code' => 'nullable|string|max:50',
            'detail.office_phone' => 'nullable|string|max:20',

            // Settings
            'settings.overtime_allowed' => 'sometimes|boolean',
            'settings.travel_allowed' => 'sometimes|boolean',
            'settings.home_office_allowed' => 'sometimes|boolean',
            'settings.meeting_room_count' => 'nullable|integer|min:0',
            'settings.desk_count' => 'nullable|integer|min:0',
            'settings.requires_approval' => 'sometimes|boolean',
            'settings.approval_level' => 'nullable|in:,Manager,Director,Head,C-Level',

            // Notes
            'notes' => 'nullable|array',
            'notes.*.id' => 'required|string',
            'notes.*.title' => 'string|max:255',
            'notes.*.note' => 'required|string',
            'notes.*.category' => 'required|string',
            'notes.*.created_at' => 'sometimes|date',
            'notes.*._isNew' => 'sometimes|boolean',
            'notes.*._isModified' => 'sometimes|boolean',
            'notes.*._isDeleted' => 'sometimes|boolean',
        ];
    }
}
