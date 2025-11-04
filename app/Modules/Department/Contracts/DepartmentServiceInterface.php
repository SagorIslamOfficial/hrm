<?php

namespace App\Modules\Department\Contracts;

use App\Modules\Department\Models\Department;

interface DepartmentServiceInterface
{
    public function createDepartment(array $data): Department;

    public function updateDepartment(string $id, array $data): Department;

    public function deleteDepartment(string $id): void;

    public function restoreDepartment(string $id): void;

    public function forceDeleteDepartment(string $id): void;

    public function getDepartmentStats(string $id): array;
}
