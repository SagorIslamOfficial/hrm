<?php

namespace App\Modules\Employee\Contracts;

use App\Modules\Employee\Models\EmployeeNote;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface EmployeeNoteRepositoryInterface
{
    public function create(array $data): EmployeeNote;

    public function findById(string $id): EmployeeNote;

    public function update(EmployeeNote $note, array $data): bool;

    public function delete(EmployeeNote $note): bool;

    public function getByEmployee(string $employeeId): Collection;

    public function getByEmployeeWithFilters(string $employeeId, array $filters = [], int $perPage = 10): LengthAwarePaginator;

    public function all(): Collection;
}
