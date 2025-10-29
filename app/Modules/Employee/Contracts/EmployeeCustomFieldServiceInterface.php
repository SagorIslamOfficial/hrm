<?php

namespace App\Modules\Employee\Contracts;

interface EmployeeCustomFieldServiceInterface
{
    /**
     * Create a custom field
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
     * Sync custom fields for an employee
     */
    public function syncCustomFields(string $employeeId, array $fields): void;
}
