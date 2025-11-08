<?php

namespace App\Modules\HR\Employee\Repositories;

use App\Modules\HR\Employee\Contracts\EmployeeCustomFieldRepositoryInterface;
use App\Modules\HR\Employee\Models\Employee;
use App\Modules\HR\Employee\Models\EmployeeCustomField;
use Illuminate\Database\Eloquent\Collection;

class EmployeeCustomFieldRepository implements EmployeeCustomFieldRepositoryInterface
{
    public function __construct(
        protected EmployeeCustomField $model
    ) {}

    public function getByEmployee(Employee|string $employee): Collection
    {
        $employeeId = $employee instanceof Employee ? $employee->id : $employee;

        return $this->model->where('employee_id', $employeeId)->get();
    }

    public function create(array $data): EmployeeCustomField
    {
        return $this->model->create($data);
    }

    public function update(string $id, array $data): bool
    {
        $customField = $this->findById($id);

        return $customField->update($data);
    }

    public function delete(string $id): bool
    {
        $customField = $this->findById($id);

        return $customField->delete();
    }

    public function findById(string $id): EmployeeCustomField
    {
        return $this->model->findOrFail($id);
    }

    public function syncCustomFields(Employee|string $employee, array $fields): void
    {
        $employeeId = $employee instanceof Employee ? $employee->id : $employee;

        // Delete all existing custom fields for this employee
        $this->model->where('employee_id', $employeeId)->delete();

        // Create new custom fields
        foreach ($fields as $field) {
            if (! empty($field['field_key']) && ! empty($field['field_value'])) {
                $this->create([
                    'employee_id' => $employeeId,
                    'field_key' => $field['field_key'],
                    'field_value' => $field['field_value'],
                    'field_type' => $field['field_type'] ?? 'text',
                    'section' => $field['section'] ?? null,
                ]);
            }
        }
    }
}
