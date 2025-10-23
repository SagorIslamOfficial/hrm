<?php

namespace App\Modules\Employee\Contracts;

use App\Modules\Employee\Models\EmployeeDocument;
use Illuminate\Database\Eloquent\Collection;

interface EmployeeDocumentRepositoryInterface
{
    public function create(array $data): EmployeeDocument;

    public function findById(int|string $id): EmployeeDocument;

    public function update(EmployeeDocument $document, array $data): bool;

    public function delete(EmployeeDocument $document): bool;

    public function getByEmployeeId(int|string $employeeId): Collection;
}
