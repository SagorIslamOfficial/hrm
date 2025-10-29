<?php

namespace App\Modules\Department\Contracts;

use App\Modules\Department\Models\Department;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface DepartmentRepositoryInterface
{
    public function create(array $data): Department;

    public function findById(int $id): Department;

    public function update(Department $department, array $data): bool;

    public function delete(Department $department): bool;

    public function all(): Collection;

    public function paginate(int $perPage = 15): LengthAwarePaginator;

    public function findByName(string $name): ?Department;
}
