<?php

namespace App\Modules\HR\Organization\Department\Contracts;

use App\Modules\HR\Organization\Department\Models\Designation;
use Illuminate\Database\Eloquent\Collection;

interface DesignationRepositoryInterface
{
    public function create(array $data): Designation;

    public function findById(string $id, array $relations = []): Designation;

    public function update(Designation $designation, array $data): bool;

    public function delete(Designation $designation): bool;

    public function restore(Designation $designation): bool;

    public function forceDelete(Designation $designation): bool;

    public function all(): Collection;

    public function findByCode(string $code): ?Designation;

    public function findByDepartment(string $departmentId): Collection;

    public function getActive(): Collection;
}
