<?php

namespace App\Modules\HR\Employee\Services;

use App\Modules\HR\Employee\Contracts\EmployeeRepositoryInterface;
use App\Modules\HR\Employee\Contracts\EmployeeServiceInterface;
use App\Modules\HR\Employee\Models\Employee;
use App\Modules\HR\Employee\Models\EmployeeContact;
use App\Modules\HR\Employee\Models\EmployeeJobDetail;
use App\Modules\HR\Employee\Models\EmployeePersonalDetail;
use App\Modules\HR\Employee\Models\EmployeeSalaryDetail;
use App\Services\UserService;
use Illuminate\Support\Facades\DB;

class EmployeeService implements EmployeeServiceInterface
{
    public function __construct(
        private EmployeeRepositoryInterface $employeeRepository,
        private UserService $userService,
    ) {}

    /**
     * Create a new employee with related data and optionally a user account.
     */
    public function createEmployee(array $data): Employee
    {
        return DB::transaction(function () use ($data) {
            // Create the main employee record
            $employee = $this->employeeRepository->create([
                'employee_code' => $data['employee_code'],
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'photo' => $data['photo'] ?? null,
                'department_id' => $data['department_id'],
                'designation_id' => $data['designation_id'],
                'employment_status' => $data['employment_status'],
                'employment_type' => $data['employment_type'],
                'joining_date' => $data['joining_date'],
                'currency' => $data['currency'] ?? 'BDT',
            ]);

            // Create related records if data provided
            $this->createOrUpdatePersonalDetail($employee->id, $data['personal_detail'] ?? []);
            $this->createOrUpdateJobDetail($employee->id, $data['job_detail'] ?? []);
            $this->createOrUpdateSalaryDetail($employee->id, $data['salary_detail'] ?? []);

            // Create user account if requested
            if (! empty($data['create_user'])) {
                $this->userService->createUserForEmployee($employee, [
                    'role' => $data['user_role'] ?? config('user.default_role.for_employee', 'Employee'),
                    'send_credentials' => $data['send_credentials'] ?? true,
                ]);
            }

            return $employee->fresh(['department', 'designation', 'personalDetail', 'jobDetail', 'salaryDetail', 'user']);
        });
    }

    /**
     * Update an existing employee with related data.
     */
    public function updateEmployee(int|string $id, array $data): Employee
    {
        return DB::transaction(function () use ($id, $data) {
            $employee = $this->employeeRepository->findById($id);

            // Update main employee record
            $employeeData = array_filter([
                'employee_code' => $data['employee_code'] ?? null,
                'first_name' => $data['first_name'] ?? null,
                'last_name' => $data['last_name'] ?? null,
                'email' => $data['email'] ?? null,
                'phone' => $data['phone'] ?? null,
                'photo' => $data['photo'] ?? null,
                'department_id' => $data['department_id'] ?? null,
                'designation_id' => $data['designation_id'] ?? null,
                'employment_status' => $data['employment_status'] ?? null,
                'employment_type' => $data['employment_type'] ?? null,
                'joining_date' => $data['joining_date'] ?? null,
                'currency' => $data['currency'] ?? null,
            ], fn ($value) => $value !== null);

            if (! empty($employeeData)) {
                $this->employeeRepository->update($employee, $employeeData);
            }

            // Update related records if data provided
            if (isset($data['personal_detail'])) {
                $this->createOrUpdatePersonalDetail($employee->id, $data['personal_detail']);
            }

            if (isset($data['job_detail'])) {
                $this->createOrUpdateJobDetail($employee->id, $data['job_detail']);
            }

            if (isset($data['salary_detail'])) {
                $this->createOrUpdateSalaryDetail($employee->id, $data['salary_detail']);
            }

            return $employee->fresh(['department', 'designation', 'personalDetail', 'jobDetail', 'salaryDetail']);
        });
    }

    /**
     * Delete an employee.
     */
    public function deleteEmployee(int|string $id): void
    {
        $employee = $this->employeeRepository->findById($id);
        $this->employeeRepository->delete($employee);
    }

    /**
     * Get employee profile data with all related information.
     */
    public function getProfile(Employee $employee): array
    {
        return [
            'id' => $employee->id,
            'employee_code' => $employee->employee_code,
            'full_name' => $employee->full_name,
            'first_name' => $employee->first_name,
            'last_name' => $employee->last_name,
            'email' => $employee->email,
            'phone' => $employee->phone,
            'photo' => $employee->photo,
            'department' => $employee->department?->name,
            'designation' => $employee->designation?->title,
            'employment_status' => $employee->employment_status,
            'employment_type' => $employee->employment_type,
            'joining_date' => $employee->joining_date,
            'personal_detail' => $employee->personalDetail?->toArray(),
            'job_detail' => $employee->jobDetail?->toArray(),
            'salary_detail' => $employee->salaryDetail?->toArray(),
            'contacts' => $employee->contacts?->toArray(),
            'documents' => $employee->documents?->toArray(),
            'notes' => $employee->notes?->toArray(),
            'attendance_records' => $employee->attendanceRecords?->toArray(),
            'leave_records' => $employee->leaveRecords?->toArray(),
            'custom_fields' => $employee->customFields?->toArray(),
        ];
    }

    /**
     * Create or update employee personal details
     */
    private function createOrUpdatePersonalDetail(string $employeeId, array $data): void
    {
        if (empty($data)) {
            return;
        }

        $filteredData = array_filter($data, fn ($value) => $value !== null);

        if (! empty($filteredData)) {
            EmployeePersonalDetail::updateOrCreate(
                ['employee_id' => $employeeId],
                $filteredData
            );
        }
    }

    /**
     * Create or update employee job details
     */
    private function createOrUpdateJobDetail(string $employeeId, array $data): void
    {
        if (empty($data)) {
            return;
        }

        $filteredData = array_filter($data, fn ($value) => $value !== null);

        if (! empty($filteredData)) {
            EmployeeJobDetail::updateOrCreate(
                ['employee_id' => $employeeId],
                $filteredData
            );
        }
    }

    /**
     * Create or update employee salary details
     */
    private function createOrUpdateSalaryDetail(string $employeeId, array $data): void
    {
        if (empty($data)) {
            return;
        }

        $filteredData = array_filter($data, fn ($value) => $value !== null);

        if (! empty($filteredData)) {
            EmployeeSalaryDetail::updateOrCreate(
                ['employee_id' => $employeeId],
                $filteredData
            );
        }
    }

    /**
     * Add a contact for an employee
     */
    public function addEmployeeContact(string $employeeId, array $data): EmployeeContact
    {
        return EmployeeContact::create([
            'employee_id' => $employeeId,
            ...$data,
        ]);
    }

    /**
     * Update an employee contact
     */
    public function updateEmployeeContact(string $contactId, array $data): bool
    {
        $contact = EmployeeContact::find($contactId);
        if (! $contact) {
            return false;
        }

        return $contact->update($data);
    }

    /**
     * Delete an employee contact
     */
    public function deleteEmployeeContact(string $contactId): bool
    {
        $contact = EmployeeContact::find($contactId);
        if (! $contact) {
            return false;
        }

        return $contact->delete();
    }
}
