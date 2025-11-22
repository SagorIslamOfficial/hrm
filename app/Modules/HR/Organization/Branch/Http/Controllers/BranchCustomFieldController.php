<?php

namespace App\Modules\HR\Organization\Branch\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\HR\Organization\Branch\Http\Requests\StoreBranchRequest;
use App\Modules\HR\Organization\Branch\Http\Requests\UpdateBranchRequest;
use App\Modules\HR\Organization\Branch\Models\Branch;
use App\Modules\HR\Organization\Branch\Models\BranchCustomField;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;

class BranchCustomFieldController extends Controller
{
    use AuthorizesRequests;

    /**
     * Get all custom fields for a branch
     */
    public function index(Branch $branch): JsonResponse
    {
        $this->authorize('viewAny', BranchCustomField::class);

        $customFields = $branch->customFields;

        return response()->json([
            'data' => $customFields,
        ]);
    }

    /**
     * Store a new custom field
     */
    public function store(StoreBranchRequest $request): JsonResponse
    {
        $this->authorize('create', BranchCustomField::class);

        try {
            $customField = BranchCustomField::create($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Custom field created successfully.',
                'data' => $customField,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create custom field.',
            ], 500);
        }
    }

    /**
     * Display a specific custom field
     */
    public function show(Branch $branch, BranchCustomField $customField): JsonResponse
    {
        $this->authorize('view', $customField);

        // Ensure the custom field belongs to the branch
        if ($customField->branch_id !== $branch->id) {
            return response()->json([
                'success' => false,
                'message' => 'Custom field not found for this branch.',
            ], 404);
        }

        return response()->json([
            'data' => $customField,
        ]);
    }

    /**
     * Update a custom field
     */
    public function update(
        UpdateBranchRequest $request,
        Branch $branch,
        BranchCustomField $customField
    ): JsonResponse {
        $this->authorize('update', $customField);

        // Ensure the custom field belongs to the branch
        if ($customField->branch_id !== $branch->id) {
            return response()->json([
                'success' => false,
                'message' => 'Custom field not found for this branch.',
            ], 404);
        }

        try {
            $customField->update($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Custom field updated successfully.',
                'data' => $customField->fresh(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update custom field.',
            ], 500);
        }
    }

    /**
     * Delete a custom field
     */
    public function destroy(Branch $branch, BranchCustomField $customField): JsonResponse
    {
        $this->authorize('delete', $customField);

        // Ensure the custom field belongs to the branch
        if ($customField->branch_id !== $branch->id) {
            return response()->json([
                'success' => false,
                'message' => 'Custom field not found for this branch.',
            ], 404);
        }

        try {
            $customField->delete();

            return response()->json([
                'success' => true,
                'message' => 'Custom field deleted successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete custom field.',
            ], 500);
        }
    }

    /**
     * Sync all custom fields for a branch
     */
    public function sync(UpdateBranchRequest $request, Branch $branch): JsonResponse
    {
        $this->authorize('sync', BranchCustomField::class);

        try {
            $fields = $request->validated();

            // Delete existing fields and create new ones
            $branch->customFields()->delete();

            foreach ($fields['custom_fields'] as $fieldData) {
                $fieldData['branch_id'] = $branch->id;
                BranchCustomField::create($fieldData);
            }

            return response()->json([
                'success' => true,
                'message' => 'Custom fields synced successfully.',
                'data' => $branch->fresh()->customFields,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to sync custom fields.',
            ], 500);
        }
    }
}
