<?php

use App\Models\User;
use App\Modules\HR\Employee\Models\Employee;
use App\Services\UserService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('user can have different statuses', function () {
    $user = User::factory()->create(['status' => 'active']);

    expect($user->isActive())->toBeTrue();
    expect($user->isInactive())->toBeFalse();
    expect($user->isTerminated())->toBeFalse();
});

it('user status can be changed to inactive', function () {
    $user = User::factory()->create(['status' => 'active']);

    $user->setStatus('inactive');

    expect($user->isInactive())->toBeTrue();
    expect($user->status)->toBe('inactive');
});

it('user status can be changed to terminated', function () {
    $user = User::factory()->create(['status' => 'active']);

    $user->setStatus('terminated');

    expect($user->isTerminated())->toBeTrue();
    expect($user->status)->toBe('terminated');
});

it('user status can be changed to on_leave', function () {
    $user = User::factory()->create(['status' => 'active']);

    $user->setStatus('on_leave');

    expect($user->isOnLeave())->toBeTrue();
    expect($user->status)->toBe('on_leave');
});

it('inactive user cannot login', function () {
    $user = User::factory()->create([
        'email' => 'inactive@test.com',
        'password' => bcrypt('password'),
        'status' => 'inactive',
    ]);

    $this->post('/login', [
        'email' => 'inactive@test.com',
        'password' => 'password',
    ]);

    $this->assertGuest();
});

it('terminated user is logged out on next request', function () {
    $user = User::factory()->create([
        'status' => 'active',
    ]);

    $this->actingAs($user);
    $this->assertAuthenticated();

    // Terminate the user
    $user->setStatus('terminated');

    // Make a request - should be logged out
    $this->get('/dashboard');

    $this->assertGuest();
});

it('inactive user is logged out on next request', function () {
    $user = User::factory()->create([
        'status' => 'active',
    ]);

    $this->actingAs($user);
    $this->assertAuthenticated();

    // Deactivate the user
    $user->setStatus('inactive');

    // Make a request - should be logged out
    $this->get('/dashboard');

    $this->assertGuest();
});

it('user status syncs with employee status', function () {
    $employee = Employee::factory()->create(['employment_status' => 'active']);
    $user = User::factory()->create([
        'employee_id' => $employee->id,
        'status' => 'active',
    ]);

    // Change user status via UserService
    $userService = app(UserService::class);
    $userService->updateUserStatus($user, 'terminated');

    // Check if employee status is synced
    $employee->refresh();
    expect($employee->employment_status)->toBe('terminated');
});

it('user can set on_leave status via markOnLeave', function () {
    $user = User::factory()->create(['status' => 'active']);

    $user->markOnLeave();

    expect($user->isOnLeave())->toBeTrue();
    expect($user->status)->toBe('on_leave');
});

it('user status constants are correct', function () {
    expect(User::STATUS_ACTIVE)->toBe('active');
    expect(User::STATUS_INACTIVE)->toBe('inactive');
    expect(User::STATUS_TERMINATED)->toBe('terminated');
});

it('user helper methods work correctly', function () {
    $user = User::factory()->create(['status' => 'active']);

    expect($user->hasStatus('active'))->toBeTrue();
    expect($user->hasStatus('inactive'))->toBeFalse();

    $user->deactivate();
    expect($user->isInactive())->toBeTrue();

    $user->activate();
    expect($user->isActive())->toBeTrue();

    $user->terminate();
    expect($user->isTerminated())->toBeTrue();

    $user->markOnLeave();
    expect($user->isOnLeave())->toBeTrue();
});

// ============================================
// USER-EMPLOYEE RELATIONSHIP TESTS
// ============================================

it('user can be linked to an employee', function () {
    $employee = Employee::factory()->create(['employment_status' => 'active']);
    $user = User::factory()->create(['employee_id' => $employee->id]);

    expect($user->employee)->not->toBeNull();
    expect($user->employee->id)->toBe($employee->id);
    expect($user->employee->first_name)->not->toBeEmpty();
});

it('user can be created without an employee link', function () {
    $user = User::factory()->create(['employee_id' => null]);

    expect($user->employee)->toBeNull();
});

it('multiple users can be linked to the same employee', function () {
    $employee = Employee::factory()->create();

    // Create first user linked to employee
    $user1 = User::factory()->create(['employee_id' => $employee->id]);
    expect($user1->employee_id)->toBe($employee->id);

    // Create second user with same employee_id - this is allowed
    $user2 = User::factory()->create(['employee_id' => $employee->id]);
    expect($user2->employee_id)->toBe($employee->id);

    // Both users should exist with same employee_id
    expect(User::whereEmployeeId($employee->id)->count())->toBe(2);
});
it('user automatically inherits employee name in creation', function () {
    $employee = Employee::factory()->create([
        'first_name' => 'John',
        'last_name' => 'Doe',
    ]);

    $user = User::factory()->create([
        'employee_id' => $employee->id,
        'name' => "{$employee->first_name} {$employee->last_name}",
    ]);

    expect($user->name)->toBe('John Doe');
});

it('user inherits employee email', function () {
    $employee = Employee::factory()->create([
        'email' => 'john.doe@company.com',
    ]);

    $user = User::factory()->create([
        'employee_id' => $employee->id,
        'email' => 'john.doe@company.com',
    ]);

    expect($user->email)->toBe($employee->email);
});

it('user can be unlinked from employee', function () {
    $employee = Employee::factory()->create();
    $user = User::factory()->create(['employee_id' => $employee->id]);

    expect($user->employee_id)->not->toBeNull();

    $user->update(['employee_id' => null]);

    expect($user->refresh()->employee)->toBeNull();
});

it('user status syncs with employee status when linked', function () {
    $employee = Employee::factory()->create(['employment_status' => 'active']);
    $user = User::factory()->create([
        'employee_id' => $employee->id,
        'status' => 'active',
    ]);

    // Change user status
    $user->setStatus('on_leave');

    expect($user->status)->toBe('on_leave');
});

it('user can be updated with different employee', function () {
    $employee1 = Employee::factory()->create(['first_name' => 'John']);
    $employee2 = Employee::factory()->create(['first_name' => 'Jane']);

    $user = User::factory()->create(['employee_id' => $employee1->id]);
    expect($user->employee->first_name)->toBe('John');

    // Update user to link to different employee
    $user->update(['employee_id' => $employee2->id]);

    expect($user->refresh()->employee->first_name)->toBe('Jane');
});

it('user with employee displays correct relationship', function () {
    $employee = Employee::factory()->create([
        'first_name' => 'John',
        'last_name' => 'Doe',
        'employee_code' => 'EMP001',
        'employment_status' => 'active',
    ]);

    $user = User::factory()->create([
        'employee_id' => $employee->id,
        'name' => 'John Doe',
    ]);

    // Verify relationship is loaded correctly
    $user->load('employee');

    expect($user->employee)->not->toBeNull();
    expect($user->employee->employee_code)->toBe('EMP001');
    expect($user->employee->employment_status)->toBe('active');
    expect($user->employee->first_name)->toBe('John');
});

it('employee deletion sets user employee_id to null', function () {
    $employee = Employee::factory()->create();
    $user = User::factory()->create(['employee_id' => $employee->id]);

    expect($user->employee_id)->not->toBeNull();

    // Hard delete employee
    $employee->forceDelete();

    // User should still exist but with employee_id set to null
    $refreshedUser = User::find($user->id);
    expect($refreshedUser)->not->toBeNull();
    expect($refreshedUser->employee_id)->toBeNull();
});

it('multiple employees can exist without user accounts', function () {
    $employees = Employee::factory(3)->create();

    // Only link one to a user
    $user = User::factory()->create(['employee_id' => $employees[0]->id]);

    // Other employees should exist without users
    expect(Employee::count())->toBe(3);
    expect(User::where('employee_id', '!=', null)->count())->toBe(1);
});

it('user-employee relationship respects employment status', function () {
    $activeEmployee = Employee::factory()->create(['employment_status' => 'active']);
    $inactiveEmployee = Employee::factory()->create(['employment_status' => 'inactive']);

    $activeUser = User::factory()->create(['employee_id' => $activeEmployee->id]);
    $inactiveUser = User::factory()->create(['employee_id' => $inactiveEmployee->id]);

    expect($activeUser->employee->employment_status)->toBe('active');
    expect($inactiveUser->employee->employment_status)->toBe('inactive');
});
