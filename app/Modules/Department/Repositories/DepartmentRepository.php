<?php

namespace App\Modules\Department\Repositories;

use App\Modules\Department\Contracts\DepartmentRepositoryInterface;
use App\Modules\Department\Models\Department;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class DepartmentRepository implements DepartmentRepositoryInterface
{
    public function create(array $data): Department
    {
        return Department::create($data);
    }

    public function findById(int $id): Department
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

    public function all(): Collection
    {
        return Department::all();
    }

    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Department::paginate($perPage);
    }

    public function findByName(string $name): ?Department
    {
        return Department::where('name', $name)->first();
    }
}
