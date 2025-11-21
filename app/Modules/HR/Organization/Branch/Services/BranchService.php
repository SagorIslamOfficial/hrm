<?php

namespace App\Modules\HR\Organization\Branch\Services;

use App\Modules\HR\Organization\Branch\Contracts\BranchRepositoryContract;
use App\Modules\HR\Organization\Branch\Contracts\BranchServiceContract;
use App\Modules\HR\Organization\Branch\Models\Branch;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BranchService implements BranchServiceContract
{
    public function __construct(
        private BranchRepositoryContract $branchRepository
    ) {}

    public function createBranch(array $data): Branch
    {
        return DB::transaction(function () use ($data) {
            // Extract nested data
            $detailData = $data['detail'] ?? null;
            $settingsData = $data['settings'] ?? null;
            $departmentData = $data['departments'] ?? null;

            // Remove nested data from main create
            unset($data['detail'], $data['settings'], $data['departments']);

            // Create main branch
            $branch = $this->branchRepository->create($data);

            // Create detail if provided
            if ($detailData !== null) {
                $branch->detail()->create(array_merge(
                    $detailData,
                    ['branch_id' => $branch->id]
                ));
            }

            // Create settings if provided
            if ($settingsData !== null) {
                $branch->settings()->create(array_merge(
                    $settingsData,
                    ['branch_id' => $branch->id]
                ));
            }

            // Sync departments if provided
            if ($departmentData !== null && is_array($departmentData)) {
                $this->syncDepartments($branch->id, $departmentData);
            }

            return $branch->fresh(['detail', 'settings', 'departments', 'manager', 'parentBranch']);
        });
    }

    public function updateBranch(string $id, array $data): Branch
    {
        return DB::transaction(function () use ($id, $data) {
            $branch = $this->branchRepository->findById($id);

            // Extract nested data
            $detailData = array_key_exists('detail', $data) ? $data['detail'] : null;
            $settingsData = array_key_exists('settings', $data) ? $data['settings'] : null;
            $notesData = array_key_exists('notes', $data) ? $data['notes'] : null;
            $departmentData = array_key_exists('departments', $data) ? $data['departments'] : null;

            // Remove nested data from main update
            unset($data['detail'], $data['settings'], $data['notes'], $data['departments']);

            // Validate hierarchy if parent_id is being changed
            if (isset($data['parent_id']) && $data['parent_id'] !== $branch->parent_id) {
                if (! $this->validateHierarchy($branch->id, $data['parent_id'])) {
                    throw new \InvalidArgumentException('Invalid hierarchy: Cannot create circular reference or set child as parent.');
                }
            }

            // Update main branch
            $this->branchRepository->update($branch, $data);

            // Update or create detail
            if ($detailData !== null) {
                $branch->detail()->updateOrCreate(
                    ['branch_id' => $branch->id],
                    $detailData
                );
            }

            // Update or create settings
            if ($settingsData !== null) {
                $branch->settings()->updateOrCreate(
                    ['branch_id' => $branch->id],
                    $settingsData
                );
            }

            // Handle notes
            if ($notesData !== null) {
                $this->syncNotes($branch, $notesData);
            }

            // Sync departments if provided
            if ($departmentData !== null && is_array($departmentData)) {
                $this->syncDepartments($branch->id, $departmentData);
            }

            return $branch->fresh(['detail', 'settings', 'notes', 'departments', 'manager', 'parentBranch']);
        });
    }

    private function syncNotes(Branch $branch, array $notesData): void
    {
        $existingNotes = $branch->notes()->get()->keyBy('id');
        $currentUserId = Auth::id();

        foreach ($notesData as $noteData) {
            // Skip flagged deletions
            if (isset($noteData['_isDeleted']) && $noteData['_isDeleted']) {
                continue;
            }

            // Unset internal flags
            unset($noteData['_isNew'], $noteData['_isModified'], $noteData['_isDeleted']);

            if (isset($existingNotes[$noteData['id']])) {
                // Update existing note with updated_by
                $existingNotes[$noteData['id']]->update([
                    ...$noteData,
                    'updated_by' => $currentUserId,
                ]);
            } else {
                // Create new note with created_by and updated_by
                $branch->notes()->create([
                    ...$noteData,
                    'created_by' => $currentUserId,
                    'updated_by' => $currentUserId,
                ]);
            }
        }

        // Delete notes marked for deletion
        foreach ($notesData as $noteData) {
            if (isset($noteData['_isDeleted']) && $noteData['_isDeleted']) {
                $branch->notes()->where('id', $noteData['id'])->delete();
            }
        }
    }

    public function deleteBranch(string $id): void
    {
        $branch = $this->branchRepository->findById($id);

        // Check if branch has child branches
        if ($branch->hasChildren()) {
            throw new \RuntimeException('Cannot delete branch with child branches. Please reassign or delete child branches first.');
        }

        $this->branchRepository->delete($branch);
    }

    public function restoreBranch(string $id): void
    {
        $branch = Branch::withTrashed()->findOrFail($id);
        $this->branchRepository->restore($branch);
    }

    public function forceDeleteBranch(string $id): void
    {
        $branch = Branch::withTrashed()->findOrFail($id);
        $this->branchRepository->forceDelete($branch);
    }

    public function getBranchStats(string $id): array
    {
        $branch = Branch::withCount(['employees', 'departments'])
            ->findOrFail($id);

        // Sum all budget allocations for departments linked to this branch
        $allocated = (float) $branch->departments()->sum('branch_department.budget_allocation');

        return [
            'id' => $branch->id,
            'name' => $branch->name,
            'code' => $branch->code,
            'type' => $branch->type,
            'employee_count' => $branch->employees_count ?? 0,
            'department_count' => $branch->departments_count ?? 0,
            'budget' => $branch->budget ?? 0.00,
            'manager' => $branch->manager?->full_name ?? null,
            'parent' => $branch->parentBranch?->name ?? null,
            'child_branches_count' => $branch->childBranches()->count(),
            'hierarchy_level' => $branch->getHierarchyLevel(),
            'is_active' => $branch->is_active,
            'status' => $branch->status,
            'allocated_budget' => $allocated,
            'remaining_budget' => $branch->budget ? (float) $branch->budget - $allocated : 0.00,
        ];
    }

    public function syncDepartments(string $branchId, array $departments): void
    {
        $branch = $this->branchRepository->findById($branchId);

        $syncData = [];
        foreach ($departments as $dept) {
            if (! is_array($dept)) {
                throw new \InvalidArgumentException('Each department entry must be an array with department_id.');
            }

            if (! isset($dept['department_id'])) {
                throw new \InvalidArgumentException('Department ID is required for each department entry.');
            }

            $departmentId = $dept['department_id'];
            $pivotData = array_filter([
                'budget_allocation' => $dept['budget_allocation'] ?? null,
                'is_primary' => $dept['is_primary'] ?? false,
            ]);

            $syncData[$departmentId] = $pivotData;
        }

        $branch->departments()->sync($syncData);
    }

    public function attachDepartment(string $branchId, string $departmentId, array $pivotData = []): void
    {
        $branch = $this->branchRepository->findById($branchId);
        $branch->departments()->attach($departmentId, $pivotData);
    }

    public function detachDepartment(string $branchId, string $departmentId): void
    {
        $branch = $this->branchRepository->findById($branchId);
        $branch->departments()->detach($departmentId);
    }

    public function updateDepartmentPivot(string $branchId, string $departmentId, array $pivotData): void
    {
        $branch = $this->branchRepository->findById($branchId);
        $branch->departments()->updateExistingPivot($departmentId, $pivotData);
    }

    public function getBranchHierarchy(string $branchId): array
    {
        $branch = $this->branchRepository->findById($branchId);

        return [
            'current' => [
                'id' => $branch->id,
                'name' => $branch->name,
                'code' => $branch->code,
                'type' => $branch->type,
                'level' => $branch->getHierarchyLevel(),
            ],
            'ancestors' => $this->getAncestors($branch),
            'descendants' => $this->getDescendants($branch),
        ];
    }

    private function getAncestors(Branch $branch): array
    {
        $ancestors = [];
        $parent = $branch->parentBranch;

        while ($parent) {
            $ancestors[] = [
                'id' => $parent->id,
                'name' => $parent->name,
                'code' => $parent->code,
                'type' => $parent->type,
            ];
            $parent = $parent->parentBranch;
        }

        return array_reverse($ancestors); // Root first
    }

    private function getDescendants(Branch $branch): array
    {
        $descendants = [];

        foreach ($branch->childBranches as $child) {
            $descendants[] = [
                'id' => $child->id,
                'name' => $child->name,
                'code' => $child->code,
                'type' => $child->type,
                'children' => $this->getDescendants($child),
            ];
        }

        return $descendants;
    }

    public function moveBranch(string $branchId, ?string $newParentId): Branch
    {
        $branch = $this->branchRepository->findById($branchId);

        if (! $this->validateHierarchy($branchId, $newParentId)) {
            throw new \InvalidArgumentException('Invalid hierarchy: Cannot create circular reference.');
        }

        $branch->update(['parent_id' => $newParentId]);

        return $branch->fresh(['parentBranch', 'childBranches']);
    }

    public function validateHierarchy(string $branchId, ?string $parentId): bool
    {
        // Null parent is always valid (main branch)
        if ($parentId === null) {
            return true;
        }

        // Cannot set self as parent
        if ($branchId === $parentId) {
            return false;
        }

        // Check if the new parent is a descendant of this branch
        // This prevents circular references
        $parent = Branch::find($parentId);
        if (! $parent) {
            return false;
        }

        // Walk up the parent chain to check for the branch
        $current = $parent;
        while ($current->parent_id !== null) {
            if ($current->parent_id === $branchId) {
                return false;
            }
            $current = $current->parentBranch;

            // Safety check to prevent infinite loops
            if (! $current) {
                break;
            }
        }

        return true;
    }
}
