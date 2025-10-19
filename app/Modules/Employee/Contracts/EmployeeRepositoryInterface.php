<?php

namespace App\Modules\Employee\Contracts;

use App\Modules\Employee\Models\Employee;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface EmployeeRepositoryInterface
{
    public function create(array $data): Employee;

    public function findById(int|string $id): Employee;

    public function update(Employee $employee, array $data): bool;

    public function delete(Employee $employee): bool;

    public function all(): Collection;

    public function paginate(int $perPage = 15, array $filters = []): LengthAwarePaginator;

    public function findByUserId(int $userId): ?Employee;
}
