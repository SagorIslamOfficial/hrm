<?php

namespace App\Modules\HR\Employee\Contracts;

use App\Modules\HR\Employee\Models\Employee;

interface EmployeeServiceInterface
{
    public function createEmployee(array $data): Employee;

    public function updateEmployee(int|string $id, array $data): Employee;

    public function deleteEmployee(int|string $id): void;

    public function getProfile(Employee $employee): array;
}
