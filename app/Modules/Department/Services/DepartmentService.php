<?php

namespace App\Modules\Department\Services;

use App\Modules\Department\Contracts\DepartmentRepositoryInterface;
use App\Modules\Department\Contracts\DepartmentServiceInterface;
use App\Modules\Department\Models\Department;

class DepartmentService implements DepartmentServiceInterface
{
    public function __construct(
        private DepartmentRepositoryInterface $departmentRepository
    ) {}

    public function createDepartment(array $data): Department
    {
        return $this->departmentRepository->create($data);
    }

    public function updateDepartment(int $id, array $data): Department
    {
        $department = $this->departmentRepository->findById($id);
        $this->departmentRepository->update($department, $data);

        return $department->fresh();
    }

    public function deleteDepartment(int $id): void
    {
        $department = $this->departmentRepository->findById($id);
        $this->departmentRepository->delete($department);
    }

    public function getDepartmentStats(int $id): array
    {
        $department = $this->departmentRepository->findById($id);

        return [
            'id' => $department->id,
            'name' => $department->name,
            'employee_count' => $department->employee_count,
            'budget' => $department->budget,
            'manager' => $department->manager?->full_name,
        ];
    }
}
