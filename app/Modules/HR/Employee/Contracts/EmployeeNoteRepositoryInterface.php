<?php

namespace App\Modules\HR\Employee\Contracts;

use App\Models\User;
use App\Modules\HR\Employee\Models\EmployeeNote;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface EmployeeNoteRepositoryInterface
{
    public function create(array $data): EmployeeNote;

    public function findById(string $id): EmployeeNote;

    public function update(EmployeeNote $note, array $data): bool;

    public function delete(EmployeeNote $note): bool;

    public function getByEmployee(string $employeeId, ?User $user = null): Collection;

    public function getByEmployeeWithFilters(string $employeeId, array $filters = [], int $perPage = 10, ?User $user = null): LengthAwarePaginator;

    public function all(): Collection;
}
