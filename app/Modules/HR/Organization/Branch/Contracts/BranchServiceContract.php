<?php

namespace App\Modules\HR\Organization\Branch\Contracts;

use App\Modules\HR\Organization\Branch\Models\Branch;

interface BranchServiceContract
{
    public function createBranch(array $data): Branch;

    public function updateBranch(string $id, array $data): Branch;

    public function deleteBranch(string $id): void;

    public function restoreBranch(string $id): void;

    public function forceDeleteBranch(string $id): void;

    public function getBranchStats(string $id): array;

    public function syncDepartments(string $branchId, array $departments): void;

    public function attachDepartment(string $branchId, string $departmentId, array $pivotData = []): void;

    public function detachDepartment(string $branchId, string $departmentId): void;

    public function updateDepartmentPivot(string $branchId, string $departmentId, array $pivotData): void;

    public function getBranchHierarchy(string $branchId): array;

    public function moveBranch(string $branchId, ?string $newParentId): Branch;

    public function validateHierarchy(string $branchId, ?string $parentId): bool;
}
