<?php

namespace App\Modules\Department\Contracts;

use App\Modules\Department\Models\Department;

interface DepartmentServiceInterface
{
    public function createDepartment(array $data): Department;

    public function updateDepartment(int $id, array $data): Department;

    public function deleteDepartment(int $id): void;

    public function getDepartmentStats(int $id): array;
}
