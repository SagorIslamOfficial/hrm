<?php

namespace App\Modules\HR\Organization\Department\Contracts;

use App\Modules\HR\Organization\Department\Models\Department;
use Illuminate\Database\Eloquent\Collection;

interface DepartmentRepositoryInterface
{
    public function create(array $data): Department;

    public function findById(string $id): Department;

    public function update(Department $department, array $data): bool;

    public function delete(Department $department): bool;

    public function restore(Department $department): bool;

    public function forceDelete(Department $department): bool;

    public function all(): Collection;

    public function findByName(string $name): ?Department;
}
