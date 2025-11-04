<?php

namespace App\Modules\Department\Repositories;

use App\Modules\Department\Contracts\DepartmentRepositoryInterface;
use App\Modules\Department\Models\Department;
use Illuminate\Database\Eloquent\Collection;

class DepartmentRepository implements DepartmentRepositoryInterface
{
    public function create(array $data): Department
    {
        return Department::create($data);
    }

    public function findById(string $id): Department
    {
        return Department::findOrFail($id);
    }

    public function update(Department $department, array $data): bool
    {
        return $department->update($data);
    }

    public function delete(Department $department): bool
    {
        return $department->delete();
    }

    public function restore(Department $department): bool
    {
        return $department->restore();
    }

    public function forceDelete(Department $department): bool
    {
        return $department->forceDelete();
    }

    public function all(): Collection
    {
        return Department::all();
    }

    public function findByName(string $name): ?Department
    {
        return Department::where('name', $name)->first();
    }
}
