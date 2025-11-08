<?php

use App\Modules\HR\Employee\Contracts\EmployeeRepositoryInterface;
use App\Modules\HR\Employee\Models\Employee;
use App\Modules\HR\Employee\Repositories\EmployeeRepository;
use App\Modules\HR\Employee\Services\EmployeeService;
use App\Modules\HR\Organization\Department\Models\Department;
use App\Modules\HR\Organization\Department\Models\Designation;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Manually bind the repository for testing
    app()->bind(EmployeeRepositoryInterface::class, EmployeeRepository::class);
});

it('can create an employee with basic data', function () {
    $service = app(EmployeeService::class);
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $data = [
        'employee_code' => 'TEST001',
        'first_name' => 'John',
        'last_name' => 'Doe',
        'email' => 'john.doe@test.com',
        'department_id' => $department->id,
        'designation_id' => $designation->id,
        'employment_status' => 'active',
        'employment_type' => 'permanent',
        'joining_date' => now()->toDateString(),
    ];

    $employee = $service->createEmployee($data);

    expect($employee)->toBeInstanceOf(Employee::class);
    expect($employee->employee_code)->toBe('TEST001');
    expect($employee->first_name)->toBe('John');
    expect($employee->last_name)->toBe('Doe');
    expect($employee->email)->toBe('john.doe@test.com');
    expect($employee->department_id)->toBe($department->id);
    expect($employee->designation_id)->toBe($designation->id);
});

it('can create an employee with related data', function () {
    $service = app(EmployeeService::class);
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $data = [
        'employee_code' => 'TEST002',
        'first_name' => 'Jane',
        'last_name' => 'Smith',
        'email' => 'jane.smith@test.com',
        'department_id' => $department->id,
        'designation_id' => $designation->id,
        'employment_status' => 'active',
        'employment_type' => 'permanent',
        'joining_date' => now()->toDateString(),
        'personal_detail' => [
            'date_of_birth' => '1990-01-01',
            'gender' => 'female',
            'marital_status' => 'single',
        ],
        'job_detail' => [
            'job_title' => 'Software Developer',
            'employment_type' => 'permanent',
        ],
        'salary_detail' => [
            'basic_salary' => 75000,
            'allowances' => 5000,
        ],
    ];

    $employee = $service->createEmployee($data);

    expect($employee->personalDetail)->not->toBeNull();
    expect($employee->personalDetail->date_of_birth->format('Y-m-d'))->toBe('1990-01-01');
    expect($employee->personalDetail->gender)->toBe('female');

    expect($employee->jobDetail)->not->toBeNull();
    expect($employee->jobDetail->job_title)->toBe('Software Developer');

    expect($employee->salaryDetail)->not->toBeNull();
    expect($employee->salaryDetail->basic_salary)->toBe('75000.00');
    expect($employee->salaryDetail->allowances)->toBe('5000.00');
});

it('can update an employee', function () {
    $service = app(EmployeeService::class);
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $updateData = [
        'first_name' => 'Updated John',
        'employment_status' => 'inactive',
        'personal_detail' => [
            'gender' => 'male',
            'marital_status' => 'married',
        ],
    ];

    $updatedEmployee = $service->updateEmployee($employee->id, $updateData);

    expect($updatedEmployee->first_name)->toBe('Updated John');
    expect($updatedEmployee->employment_status)->toBe('inactive');
    expect($updatedEmployee->personalDetail->gender)->toBe('male');
    expect($updatedEmployee->personalDetail->marital_status)->toBe('married');
});

it('can delete an employee', function () {
    $service = app(EmployeeService::class);
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $employeeId = $employee->id;
    expect(Employee::find($employeeId))->not->toBeNull();

    $service->deleteEmployee($employeeId);

    expect(Employee::find($employeeId))->toBeNull();
});
