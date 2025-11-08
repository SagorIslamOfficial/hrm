<?php

namespace App\Modules\HR\Employee\Contracts;

use App\Modules\HR\Employee\Models\Employee;
use Illuminate\Database\Eloquent\Collection;

interface EmployeeCustomFieldRepositoryInterface
{
    /**
     * Get all custom fields for an employee
     */
    public function getByEmployee(Employee|string $employee): Collection;

    /**
     * Create a custom field for an employee
     */
    public function create(array $data): mixed;

    /**
     * Update a custom field
     */
    public function update(string $id, array $data): bool;

    /**
     * Delete a custom field
     */
    public function delete(string $id): bool;

    /**
     * Find a custom field by ID
     */
    public function findById(string $id): mixed;

    /**
     * Sync custom fields for an employee
     */
    public function syncCustomFields(Employee|string $employee, array $fields): void;
}
