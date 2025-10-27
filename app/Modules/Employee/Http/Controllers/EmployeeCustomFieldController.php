<?php

namespace App\Modules\Employee\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Employee\Contracts\EmployeeCustomFieldServiceInterface;
use App\Modules\Employee\Http\Requests\StoreEmployeeCustomFieldRequest;
use App\Modules\Employee\Http\Requests\UpdateEmployeeCustomFieldRequest;
use App\Modules\Employee\Models\Employee;
use App\Modules\Employee\Models\EmployeeCustomField;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class EmployeeCustomFieldController extends Controller
{
    public function __construct(
        protected EmployeeCustomFieldServiceInterface $customFieldService
    ) {}

    /**
     * Get all custom fields for an employee
     */
    public function index(Employee $employee): JsonResponse
    {
        $customFields = $employee->customFields;

        return response()->json([
            'customFields' => $customFields,
        ]);
    }

    /**
     * Store a new custom field
     */
    public function store(StoreEmployeeCustomFieldRequest $request): JsonResponse
    {
        try {
            $customField = $this->customFieldService->create($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Custom field created successfully.',
                'customField' => $customField,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Failed to create custom field: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to create custom field.',
            ], 500);
        }
    }

    /**
     * Display a specific custom field
     */
    public function show(Employee $employee, EmployeeCustomField $customField): JsonResponse
    {
        // Ensure the custom field belongs to the employee
        if ($customField->employee_id !== $employee->id) {
            return response()->json([
                'success' => false,
                'message' => 'Custom field not found for this employee.',
            ], 404);
        }

        return response()->json([
            'customField' => $customField,
        ]);
    }

    /**
     * Update a custom field
     */
    public function update(
        UpdateEmployeeCustomFieldRequest $request,
        Employee $employee,
        EmployeeCustomField $customField
    ): JsonResponse {
        // Ensure the custom field belongs to the employee
        if ($customField->employee_id !== $employee->id) {
            return response()->json([
                'success' => false,
                'message' => 'Custom field not found for this employee.',
            ], 404);
        }

        try {
            $this->customFieldService->update($customField->id, $request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Custom field updated successfully.',
                'customField' => $customField->fresh(),
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update custom field: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to update custom field.',
            ], 500);
        }
    }

    /**
     * Delete a custom field
     */
    public function destroy(Employee $employee, EmployeeCustomField $customField): JsonResponse
    {
        // Ensure the custom field belongs to the employee
        if ($customField->employee_id !== $employee->id) {
            return response()->json([
                'success' => false,
                'message' => 'Custom field not found for this employee.',
            ], 404);
        }

        try {
            $this->customFieldService->delete($customField->id);

            return response()->json([
                'success' => true,
                'message' => 'Custom field deleted successfully.',
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to delete custom field: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete custom field.',
            ], 500);
        }
    }

    /**
     * Sync all custom fields for an employee
     */
    public function sync(Employee $employee): JsonResponse
    {
        try {
            $fields = request()->validate([
                'custom_fields' => ['required', 'array'],
                'custom_fields.*.field_key' => ['required', 'string', 'regex:/^[a-z0-9-_]+$/'],
                'custom_fields.*.field_value' => ['nullable', 'string'],
                'custom_fields.*.field_type' => ['required', 'in:text,number,date,boolean,select,textarea,email,phone,url'],
                'custom_fields.*.section' => ['nullable', 'string'],
            ]);

            $this->customFieldService->syncCustomFields($employee->id, $fields['custom_fields']);

            return response()->json([
                'success' => true,
                'message' => 'Custom fields synced successfully.',
                'customFields' => $employee->fresh()->customFields,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to sync custom fields: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to sync custom fields.',
            ], 500);
        }
    }
}
