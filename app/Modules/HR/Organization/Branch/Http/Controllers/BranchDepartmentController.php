<?php

namespace App\Modules\HR\Organization\Branch\Http\Controllers;

use App\Modules\HR\Organization\Branch\Models\Branch;
use App\Modules\HR\Organization\Branch\Services\BranchService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class BranchDepartmentController
{
    use AuthorizesRequests;

    public function __construct(
        private BranchService $branchService
    ) {}

    public function assign(Request $request, string $branchId)
    {
        $branch = Branch::findOrFail($branchId);
        $this->authorize('update', $branch);

        $validated = $request->validate([
            'department_id' => 'required|exists:departments,id',
            'budget_allocation' => 'nullable|numeric|min:0',
            'is_primary' => 'sometimes|boolean',
        ]);

        // Check if department is already assigned
        if ($branch->departments()->where('department_id', $validated['department_id'])->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'This department is already assigned to the branch.',
            ], 422);
        }

        try {
            $this->branchService->attachDepartment(
                $branchId,
                $validated['department_id'],
                array_filter([
                    'budget_allocation' => $validated['budget_allocation'] ?? null,
                    'is_primary' => $validated['is_primary'] ?? true,
                ])
            );

            return response()->json([
                'success' => true,
                'message' => 'Department assigned successfully.',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to assign department. Please try again.',
            ], 500);
        }
    }

    public function update(Request $request, string $branchId, string $departmentId)
    {
        $branch = Branch::findOrFail($branchId);
        $this->authorize('update', $branch);

        $validated = $request->validate([
            'budget_allocation' => 'nullable|numeric|min:0',
            'is_primary' => 'sometimes|boolean',
        ]);

        try {
            $this->branchService->updateDepartmentPivot(
                $branchId,
                $departmentId,
                array_filter($validated, fn ($value) => $value !== null)
            );

            return response()->json([
                'success' => true,
                'message' => 'Department updated successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update department. Please try again.',
            ], 500);
        }
    }

    public function detach(string $branchId, string $departmentId)
    {
        $branch = Branch::findOrFail($branchId);
        $this->authorize('update', $branch);

        // Check if department exists in this branch
        if (! $branch->departments()->where('department_id', $departmentId)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Department not found in this branch.',
            ], 404);
        }

        try {
            $this->branchService->detachDepartment($branchId, $departmentId);

            return response()->json([
                'success' => true,
                'message' => 'Department removed successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove department. Please try again.',
            ], 500);
        }
    }
}
