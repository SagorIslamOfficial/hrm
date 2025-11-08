<?php

use App\Models\User;
use App\Modules\HR\Employee\Models\Employee;
use App\Modules\HR\Employee\Models\EmploymentType;
use App\Modules\HR\Organization\Department\Models\Department;
use App\Modules\HR\Organization\Department\Models\Designation;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

it('can display the employee index page', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);
    Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);
    Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $response = $this->actingAs($user)->get(route('employees.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->component('modules/employee/index')
        ->has('employees', 3)
    );
});

it('can display the employee create page', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('employees.create'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->component('modules/employee/create')
        ->has('departments')
        ->has('designations')
    );
});

it('can create a new employee with valid data', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    // Create employment type for validation
    $employmentType = EmploymentType::factory()->state([
        'name' => 'Permanent',
        'code' => 'permanent',
        'is_active' => true,
    ])->create();

    $employeeData = [
        'employee_code' => 'EMP001',
        'first_name' => 'John',
        'last_name' => 'Doe',
        'email' => 'john.doe@company.com',
        'phone' => '123-456-7890',
        'department_id' => $department->id,
        'designation_id' => $designation->id,
        'employment_status' => 'active',
        'employment_type' => 'permanent',
        'joining_date' => now()->toDateString(),
    ];

    $response = $this->actingAs($user)->post(route('employees.store'), $employeeData);

    expect(Employee::count())->toBe(1);

    $employee = Employee::first();
    expect($employee->employee_code)->toBe('EMP001');
    expect($employee->first_name)->toBe('John');
    expect($employee->last_name)->toBe('Doe');
    expect($employee->email)->toBe('john.doe@company.com');
    expect($employee->department_id)->toBe($department->id);
    expect($employee->designation_id)->toBe($designation->id);

    $response->assertRedirect(route('employees.edit', $employee->id));
    $response->assertSessionHas('success');
});

it('validates required fields when creating employee', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('employees.store'), []);

    $response->assertSessionHasErrors([
        'employee_code',
        'first_name',
        'last_name',
        'email',
        'department_id',
        'designation_id',
        'employment_status',
        'employment_type',
        'joining_date',
    ]);
});

it('validates unique employee code', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    Employee::factory()->create([
        'employee_code' => 'EMP001',
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $employeeData = [
        'employee_code' => 'EMP001', // Duplicate
        'first_name' => 'Jane',
        'last_name' => 'Smith',
        'email' => 'jane.smith@company.com',
        'department_id' => $department->id,
        'designation_id' => $designation->id,
        'employment_status' => 'active',
        'employment_type' => 'permanent',
        'joining_date' => now()->toDateString(),
    ];

    $response = $this->actingAs($user)->post(route('employees.store'), $employeeData);

    $response->assertSessionHasErrors(['employee_code']);
});

it('validates unique email', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    Employee::factory()->create([
        'email' => 'john.doe@company.com',
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $employeeData = [
        'employee_code' => 'EMP002',
        'first_name' => 'Jane',
        'last_name' => 'Smith',
        'email' => 'john.doe@company.com', // Duplicate
        'department_id' => $department->id,
        'designation_id' => $designation->id,
        'employment_status' => 'active',
        'employment_type' => 'permanent',
        'joining_date' => now()->toDateString(),
    ];

    $response = $this->actingAs($user)->post(route('employees.store'), $employeeData);

    $response->assertSessionHasErrors(['email']);
});

it('can display the employee show page', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $response = $this->actingAs($user)->get(route('employees.show', $employee));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->component('modules/employee/show')
        ->has('employee')
        ->where('employee.id', $employee->id)
    );
});

it('can display the employee edit page', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $response = $this->actingAs($user)->get(route('employees.edit', $employee));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->component('modules/employee/edit')
        ->has('employee')
        ->has('departments')
        ->has('designations')
        ->has('supervisors')
        ->where('employee.id', $employee->id)
    );
});

it('can update an employee with valid data', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    // Create employment type for validation
    EmploymentType::factory()->state([
        'name' => 'Permanent',
        'code' => 'permanent',
        'is_active' => true,
    ])->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $updateData = [
        'first_name' => 'Updated John',
        'last_name' => 'Updated Doe',
        'email' => 'updated.john@company.com',
        'employment_status' => 'inactive',
        'personal_detail' => [
            'date_of_birth' => '1990-01-01',
            'gender' => 'male',
            'marital_status' => 'married',
        ],
        'job_detail' => [
            'job_title' => 'Senior Developer',
            'employment_type' => 'permanent',
        ],
        'salary_detail' => [
            'basic_salary' => 75000,
            'allowances' => 5000,
        ],
    ];

    $response = $this->actingAs($user)->put(route('employees.update', $employee), $updateData);

    $employee->refresh();
    expect($employee->first_name)->toBe('Updated John');
    expect($employee->last_name)->toBe('Updated Doe');
    expect($employee->email)->toBe('updated.john@company.com');
    expect($employee->employment_status)->toBe('inactive');

    expect($employee->personalDetail)->not->toBeNull();
    expect($employee->personalDetail->date_of_birth->format('Y-m-d'))->toBe('1990-01-01');
    expect($employee->personalDetail->gender)->toBe('male');
    expect($employee->personalDetail->marital_status)->toBe('married');

    expect($employee->jobDetail)->not->toBeNull();
    expect($employee->jobDetail->job_title)->toBe('Senior Developer');

    expect($employee->salaryDetail)->not->toBeNull();
    expect($employee->salaryDetail->basic_salary)->toBe('75000.00');
    expect($employee->salaryDetail->allowances)->toBe('5000.00');

    $response->assertRedirect(route('employees.show', $employee));
    $response->assertSessionHas('success');
});

it('can delete an employee', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    expect(Employee::count())->toBe(1);

    $response = $this->actingAs($user)->delete(route('employees.destroy', $employee));

    expect(Employee::count())->toBe(0);
    $response->assertRedirect(route('employees.index'));
    $response->assertSessionHas('success');
});

it('creates related data when creating employee with nested data', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    // Create employment type for validation
    EmploymentType::factory()->state([
        'name' => 'Permanent',
        'code' => 'permanent',
        'is_active' => true,
    ])->create();

    $employeeData = [
        'employee_code' => 'EMP001',
        'first_name' => 'John',
        'last_name' => 'Doe',
        'email' => 'john.doe@company.com',
        'department_id' => $department->id,
        'designation_id' => $designation->id,
        'employment_status' => 'active',
        'employment_type' => 'permanent',
        'joining_date' => now()->toDateString(),
        'personal_detail' => [
            'date_of_birth' => '1990-01-01',
            'gender' => 'male',
        ],
        'job_detail' => [
            'job_title' => 'Developer',
        ],
        'salary_detail' => [
            'basic_salary' => 60000,
        ],
    ];

    $response = $this->actingAs($user)->post(route('employees.store'), $employeeData);

    $employee = Employee::with(['personalDetail', 'jobDetail', 'salaryDetail'])->first();
    expect($employee->personalDetail)->not->toBeNull();
    expect($employee->personalDetail->date_of_birth->format('Y-m-d'))->toBe('1990-01-01');
    expect($employee->personalDetail->gender)->toBe('male');

    expect($employee->jobDetail)->not->toBeNull();
    expect($employee->jobDetail->job_title)->toBe('Developer');

    expect($employee->salaryDetail)->not->toBeNull();
    expect($employee->salaryDetail->basic_salary)->toBe('60000.00');
});

// Photo Upload Tests
it('can create employee with photo upload', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    // Create employment type for validation
    EmploymentType::factory()->state([
        'name' => 'Permanent',
        'code' => 'permanent',
        'is_active' => true,
    ])->create();

    $employeeData = [
        'employee_code' => 'EMP001',
        'first_name' => 'John',
        'last_name' => 'Doe',
        'email' => 'john.doe@company.com',
        'department_id' => $department->id,
        'designation_id' => $designation->id,
        'employment_status' => 'active',
        'employment_type' => 'permanent',
        'joining_date' => now()->toDateString(),
    ];

    $photo = UploadedFile::fake()->image('employee.jpg', 300, 300)->size(1000);

    $response = $this->actingAs($user)->post(route('employees.store'), array_merge($employeeData, [
        'photo' => $photo,
    ]));

    $employee = Employee::first();
    expect($employee)->not->toBeNull();
    expect($employee->photo)->not->toBeNull();

    expect($employee->photo_url)->toContain('storage/employees/photos/');

    // Check file was stored with correct naming convention
    expect($employee->photo)->toContain('emp001-john-doe.jpg');

    // Check the file exists in storage using the actual stored path
    expect(Storage::disk('public')->exists($employee->photo))->toBeTrue();
});

it('validates photo upload requirements', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    // Create employment type for validation
    EmploymentType::factory()->state([
        'name' => 'Permanent',
        'code' => 'permanent',
        'is_active' => true,
    ])->create();

    $employeeData = [
        'employee_code' => 'EMP001',
        'first_name' => 'John',
        'last_name' => 'Doe',
        'email' => 'john.doe@company.com',
        'department_id' => $department->id,
        'designation_id' => $designation->id,
        'employment_status' => 'active',
        'employment_type' => 'permanent',
        'joining_date' => now()->toDateString(),
    ];

    // Test file too large (over 5MB)
    $largePhoto = UploadedFile::fake()->image('large.jpg')->size(6000);
    $response = $this->actingAs($user)->post(route('employees.store'), array_merge($employeeData, [
        'photo' => $largePhoto,
    ]));
    $response->assertSessionHasErrors(['photo']);

    // Test invalid file type
    $invalidFile = UploadedFile::fake()->create('document.pdf', 1000);
    $response = $this->actingAs($user)->post(route('employees.store'), array_merge($employeeData, [
        'photo' => $invalidFile,
    ]));
    $response->assertSessionHasErrors(['photo']);

    // Test image too small (under 100x100)
    $smallPhoto = UploadedFile::fake()->image('small.jpg', 50, 50);
    $response = $this->actingAs($user)->post(route('employees.store'), array_merge($employeeData, [
        'photo' => $smallPhoto,
    ]));
    $response->assertSessionHasErrors(['photo']);
});

it('can update employee photo', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'employee_code' => 'EMP001',
        'first_name' => 'John',
        'last_name' => 'Doe',
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    // Upload initial photo
    $initialPhoto = UploadedFile::fake()->image('initial.jpg', 300, 300);
    $employee->uploadPhoto($initialPhoto);
    $initialPhotoPath = $employee->photo;

    // Update with new photo
    $newPhoto = UploadedFile::fake()->image('updated.jpg', 400, 400);
    $response = $this->actingAs($user)->put(route('employees.update', $employee), [
        'photo' => $newPhoto,
    ]);

    $employee->refresh();

    // Photo should still exist (filename might be the same due to same employee name)
    expect($employee->photo)->not->toBeNull();
    expect($employee->photo_url)->toContain('storage/employees/photos/');

    // Photo file should exist in storage
    expect(Storage::disk('public')->exists($employee->photo))->toBeTrue();

    // Response should be successful
    $response->assertRedirect();
});

it('can delete employee photo', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    // Upload photo first
    $photo = UploadedFile::fake()->image('employee.jpg', 300, 300);
    $employee->uploadPhoto($photo);
    $photoPath = $employee->photo;

    expect($employee->photo)->not->toBeNull();
    expect(Storage::disk('public')->exists($photoPath))->toBeTrue();

    // Delete photo via update request
    $response = $this->actingAs($user)->put(route('employees.update', $employee), [
        'delete_photo' => true,
    ]);

    $employee->refresh();
    expect($employee->photo)->toBeNull();
    expect($employee->photo_url)->toBeNull();

    // Photo file should be deleted
    expect(Storage::disk('public')->exists($photoPath))->toBeFalse();
});

it('cleans up photo when employee is deleted', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    // Upload photo
    $photo = UploadedFile::fake()->image('employee.jpg', 300, 300);
    $employee->uploadPhoto($photo);
    $photoPath = $employee->photo;

    expect(Storage::disk('public')->exists($photoPath))->toBeTrue();

    // Delete employee
    $response = $this->actingAs($user)->delete(route('employees.destroy', $employee));

    // Photo should be cleaned up
    expect(Storage::disk('public')->exists($photoPath))->toBeFalse();
});

it('handles photo upload errors gracefully', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    // Create employment type for validation
    EmploymentType::factory()->state([
        'name' => 'Permanent',
        'code' => 'permanent',
        'is_active' => true,
    ])->create();

    // Mock Storage to simulate failure
    Storage::shouldReceive('disk->put')->andReturn(false);

    $employeeData = [
        'employee_code' => 'EMP001',
        'first_name' => 'John',
        'last_name' => 'Doe',
        'email' => 'john.doe@company.com',
        'department_id' => $department->id,
        'designation_id' => $designation->id,
        'employment_status' => 'active',
        'employment_type' => 'permanent',
        'joining_date' => now()->toDateString(),
    ];

    $photo = UploadedFile::fake()->image('employee.jpg', 300, 300);

    $response = $this->actingAs($user)->post(route('employees.store'), array_merge($employeeData, [
        'photo' => $photo,
    ]));

    // Should redirect back with error
    $response->assertRedirect();
    $response->assertSessionHasErrors(['photo']);
});
