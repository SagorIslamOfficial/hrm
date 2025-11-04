<?php

namespace App\Modules\Department\Repositories;

use App\Modules\Department\Contracts\DesignationRepositoryInterface;
use App\Modules\Department\Models\Designation;
use Illuminate\Database\Eloquent\Collection;

class DesignationRepository implements DesignationRepositoryInterface
{
    public function create(array $data): Designation
    {
        return Designation::create($data);
    }

    public function findById(string $id, array $relations = []): Designation
    {
        return Designation::with(array_merge(['department'], $relations))->findOrFail($id);
    }

    public function update(Designation $designation, array $data): bool
    {
        return $designation->update($data);
    }

    public function delete(Designation $designation): bool
    {
        return $designation->delete();
    }

    public function restore(Designation $designation): bool
    {
        return $designation->restore();
    }

    public function forceDelete(Designation $designation): bool
    {
        return $designation->forceDelete();
    }

    public function all(): Collection
    {
        return Designation::with('department')
            ->withCount('employees')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function findByCode(string $code): ?Designation
    {
        return Designation::where('code', $code)->first();
    }

    public function findByDepartment(string $departmentId): Collection
    {
        return Designation::where('department_id', $departmentId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getActive(): Collection
    {
        return Designation::where('is_active', true)
            ->with('department')
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
