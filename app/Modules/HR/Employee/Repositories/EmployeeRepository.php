<?php

namespace App\Modules\HR\Employee\Repositories;

use App\Modules\HR\Employee\Contracts\EmployeeRepositoryInterface;
use App\Modules\HR\Employee\Models\Employee;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class EmployeeRepository implements EmployeeRepositoryInterface
{
    public function create(array $data): Employee
    {
        return Employee::create($data);
    }

    public function findById(int|string $id): Employee
    {
        return Employee::findOrFail($id);
    }

    public function update(Employee $employee, array $data): bool
    {
        return $employee->update($data);
    }

    public function delete(Employee $employee): bool
    {
        return $employee->delete();
    }

    public function all(): Collection
    {
        return Employee::all();
    }

    public function paginate(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $query = Employee::select([
            'employees.id',
            'employees.employee_code',
            'employees.first_name',
            'employees.last_name',
            'employees.email',
            'employees.phone',
            'employees.employment_status',
            'employees.employment_type',
            'employees.joining_date',
            'employees.created_at',
            'departments.name as department_name',
            'designations.title as designation_title',
        ])
            ->leftJoin('departments', 'employees.department_id', '=', 'departments.id')
            ->leftJoin('designations', 'employees.designation_id', '=', 'designations.id');

        // Apply search filter
        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('employees.employee_code', 'like', "%{$search}%")
                    ->orWhere('employees.first_name', 'like', "%{$search}%")
                    ->orWhere('employees.last_name', 'like', "%{$search}%")
                    ->orWhere('employees.email', 'like', "%{$search}%")
                    ->orWhere('departments.name', 'like', "%{$search}%")
                    ->orWhere('designations.title', 'like', "%{$search}%");
            });
        }

        // Apply department filter
        if (! empty($filters['department_id'])) {
            $query->where('employees.department_id', $filters['department_id']);
        }

        // Apply designation filter
        if (! empty($filters['designation_id'])) {
            $query->where('employees.designation_id', $filters['designation_id']);
        }

        // Apply employment status filter
        if (! empty($filters['employment_status'])) {
            $query->where('employees.employment_status', $filters['employment_status']);
        }

        // Apply employment type filter
        if (! empty($filters['employment_type'])) {
            $query->where('employees.employment_type', $filters['employment_type']);
        }

        // Apply date range filter for joining date
        if (! empty($filters['joining_date_from'])) {
            $query->where('employees.joining_date', '>=', $filters['joining_date_from']);
        }
        if (! empty($filters['joining_date_to'])) {
            $query->where('employees.joining_date', '<=', $filters['joining_date_to']);
        }

        return $query->paginate($perPage);
    }

    public function findByUserId(int $userId): ?Employee
    {
        return Employee::where('user_id', $userId)->first();
    }
}
