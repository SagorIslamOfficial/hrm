<?php

use App\Models\User;
use App\Modules\HR\Employee\Models\Employee;
use App\Modules\HR\Employee\Models\EmployeeNote;
use App\Modules\HR\Organization\Department\Models\Department;
use App\Modules\HR\Organization\Department\Models\Designation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Create permissions
    Permission::create(['name' => 'view-private-notes']);
    Permission::create(['name' => 'manage-private-notes']);

    // Create roles
    $adminRole = Role::create(['name' => 'Admin']);
    $hrRole = Role::create(['name' => 'HR']);
    $managerRole = Role::create(['name' => 'Manager']);
    Role::create(['name' => 'Employee']);

    // Assign permissions
    $adminRole->givePermissionTo(['view-private-notes', 'manage-private-notes']);
    $hrRole->givePermissionTo(['view-private-notes', 'manage-private-notes']);
    $managerRole->givePermissionTo(['view-private-notes']);
});

test('admin can view all private notes', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $otherUser = User::factory()->create();

    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    // Create a private note by another user
    $privateNote = EmployeeNote::factory()->private()->create([
        'employee_id' => $employee->id,
        'created_by' => $otherUser->id,
        'title' => 'Private Note by Other User',
    ]);

    $response = $this->actingAs($admin)
        ->getJson("/dashboard/hr/employee/{$employee->id}/notes");

    $response->assertSuccessful();

    $noteIds = collect($response->json('notes'))->pluck('id')->toArray();
    expect($noteIds)->toContain($privateNote->id);
});

test('HR can view all private notes', function () {
    $hr = User::factory()->create();
    $hr->assignRole('HR');

    $otherUser = User::factory()->create();

    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    // Create a private note by another user
    $privateNote = EmployeeNote::factory()->private()->create([
        'employee_id' => $employee->id,
        'created_by' => $otherUser->id,
        'title' => 'HR Test Private Note',
    ]);

    $response = $this->actingAs($hr)
        ->getJson("/dashboard/hr/employee/{$employee->id}/notes");

    $response->assertSuccessful();

    $noteIds = collect($response->json('notes'))->pluck('id')->toArray();
    expect($noteIds)->toContain($privateNote->id);
});

test('manager can view private notes with permission', function () {
    $manager = User::factory()->create();
    $manager->assignRole('Manager');

    $otherUser = User::factory()->create();

    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    // Create a private note by another user
    $privateNote = EmployeeNote::factory()->private()->create([
        'employee_id' => $employee->id,
        'created_by' => $otherUser->id,
        'title' => 'Manager Test Private Note',
    ]);

    $response = $this->actingAs($manager)
        ->getJson("/dashboard/hr/employee/{$employee->id}/notes");

    $response->assertSuccessful();

    $noteIds = collect($response->json('notes'))->pluck('id')->toArray();
    expect($noteIds)->toContain($privateNote->id);
});

test('regular user cannot view other users private notes', function () {
    $user = User::factory()->create();
    $user->assignRole('Employee');

    $otherUser = User::factory()->create();
    $otherUser->assignRole('Employee');

    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    // Create a private note by another user
    $privateNote = EmployeeNote::factory()->private()->create([
        'employee_id' => $employee->id,
        'created_by' => $otherUser->id,
        'title' => 'Other User Private Note',
    ]);

    $response = $this->actingAs($user)
        ->getJson("/dashboard/hr/employee/{$employee->id}/notes");

    $response->assertSuccessful();

    $noteIds = collect($response->json('notes'))->pluck('id')->toArray();
    expect($noteIds)->not->toContain($privateNote->id);
});

test('user can view their own private notes', function () {
    $user = User::factory()->create();
    $user->assignRole('Employee');

    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    // Create a private note by the user
    $myPrivateNote = EmployeeNote::factory()->private()->create([
        'employee_id' => $employee->id,
        'created_by' => $user->id,
        'title' => 'My Private Note',
    ]);

    $response = $this->actingAs($user)
        ->getJson("/dashboard/hr/employee/{$employee->id}/notes");

    $response->assertSuccessful();

    $noteIds = collect($response->json('notes'))->pluck('id')->toArray();
    expect($noteIds)->toContain($myPrivateNote->id);
});

test('all users can view public notes', function () {
    $user = User::factory()->create();
    $user->assignRole('Employee');

    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    // Create a public note
    $publicNote = EmployeeNote::factory()->create([
        'employee_id' => $employee->id,
        'is_private' => false,
        'title' => 'Public Note',
    ]);

    $response = $this->actingAs($user)
        ->getJson("/dashboard/hr/employee/{$employee->id}/notes");

    $response->assertSuccessful();

    $noteIds = collect($response->json('notes'))->pluck('id')->toArray();
    expect($noteIds)->toContain($publicNote->id);
});

test('admin can view private note details', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $otherUser = User::factory()->create();

    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $privateNote = EmployeeNote::factory()->private()->create([
        'employee_id' => $employee->id,
        'created_by' => $otherUser->id,
        'title' => 'Admin View Private Note',
    ]);

    $response = $this->actingAs($admin)
        ->getJson("/dashboard/hr/employee/{$employee->id}/notes/{$privateNote->id}");

    $response->assertSuccessful()
        ->assertJson([
            'note' => [
                'id' => $privateNote->id,
                'is_private' => true,
            ],
        ]);
});

test('regular user cannot view other users private note details', function () {
    $user = User::factory()->create();
    $user->assignRole('Employee');

    $otherUser = User::factory()->create();

    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $privateNote = EmployeeNote::factory()->private()->create([
        'employee_id' => $employee->id,
        'created_by' => $otherUser->id,
        'title' => 'Regular User Private Note',
    ]);

    $response = $this->actingAs($user)
        ->getJson("/dashboard/hr/employee/{$employee->id}/notes/{$privateNote->id}");

    $response->assertForbidden();
});

test('note creator can update their own private note', function () {
    $user = User::factory()->create();
    $user->assignRole('Employee');

    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $myPrivateNote = EmployeeNote::factory()->private()->create([
        'employee_id' => $employee->id,
        'created_by' => $user->id,
        'note' => 'Original private note',
    ]);

    $response = $this->actingAs($user)
        ->putJson("/dashboard/hr/employee/{$employee->id}/notes/{$myPrivateNote->id}", [
            'title' => 'Updated Private Note',
            'note' => 'Updated private note',
            'category' => 'performance',
            'is_private' => true,
        ]);

    $response->assertSuccessful()
        ->assertJson([
            'success' => true,
            'note' => [
                'note' => 'Updated private note',
            ],
        ]);
});

test('regular user cannot update other users private note', function () {
    $user = User::factory()->create();
    $user->assignRole('Employee');

    $otherUser = User::factory()->create();
    $otherUser->assignRole('Employee');

    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $privateNote = EmployeeNote::factory()->private()->create([
        'employee_id' => $employee->id,
        'created_by' => $otherUser->id,
    ]);

    $response = $this->actingAs($user)
        ->putJson("/dashboard/hr/employee/{$employee->id}/notes/{$privateNote->id}", [
            'title' => 'Attempted Update',
            'note' => 'Attempted update',
            'category' => 'general',
            'is_private' => true,
        ]);

    $response->assertForbidden();
});

test('admin can update any private note', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $otherUser = User::factory()->create();

    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $privateNote = EmployeeNote::factory()->private()->create([
        'employee_id' => $employee->id,
        'created_by' => $otherUser->id,
        'note' => 'Original note',
    ]);

    $response = $this->actingAs($admin)
        ->putJson("/dashboard/hr/employee/{$employee->id}/notes/{$privateNote->id}", [
            'title' => 'Admin Updated Note',
            'note' => 'Admin updated note',
            'category' => 'general',
            'is_private' => true,
        ]);

    $response->assertSuccessful()
        ->assertJson([
            'success' => true,
            'note' => [
                'note' => 'Admin updated note',
            ],
        ]);
});

test('HR can update any private note with manage permission', function () {
    $hr = User::factory()->create();
    $hr->assignRole('HR');

    $otherUser = User::factory()->create();

    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $privateNote = EmployeeNote::factory()->private()->create([
        'employee_id' => $employee->id,
        'created_by' => $otherUser->id,
        'note' => 'Original note',
    ]);

    $response = $this->actingAs($hr)
        ->putJson("/dashboard/hr/employee/{$employee->id}/notes/{$privateNote->id}", [
            'title' => 'HR Updated Note',
            'note' => 'HR updated note',
            'category' => 'general',
            'is_private' => true,
        ]);

    $response->assertSuccessful()
        ->assertJson([
            'success' => true,
            'note' => [
                'note' => 'HR updated note',
            ],
        ]);
});

test('note creator can delete their own private note', function () {
    $user = User::factory()->create();
    $user->assignRole('Employee');

    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $myPrivateNote = EmployeeNote::factory()->private()->create([
        'employee_id' => $employee->id,
        'created_by' => $user->id,
    ]);

    $response = $this->actingAs($user)
        ->deleteJson("/dashboard/hr/employee/{$employee->id}/notes/{$myPrivateNote->id}");

    $response->assertSuccessful()
        ->assertJson([
            'success' => true,
            'message' => 'Note deleted successfully.',
        ]);

    expect(EmployeeNote::find($myPrivateNote->id))->toBeNull();
});

test('regular user cannot delete other users private note', function () {
    $user = User::factory()->create();
    $user->assignRole('Employee');

    $otherUser = User::factory()->create();
    $otherUser->assignRole('Employee');

    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $privateNote = EmployeeNote::factory()->private()->create([
        'employee_id' => $employee->id,
        'created_by' => $otherUser->id,
    ]);

    $response = $this->actingAs($user)
        ->deleteJson("/dashboard/hr/employee/{$employee->id}/notes/{$privateNote->id}");

    $response->assertForbidden();

    expect(EmployeeNote::find($privateNote->id))->not->toBeNull();
});

test('admin can delete any private note', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $otherUser = User::factory()->create();

    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $privateNote = EmployeeNote::factory()->private()->create([
        'employee_id' => $employee->id,
        'created_by' => $otherUser->id,
    ]);

    $response = $this->actingAs($admin)
        ->deleteJson("/dashboard/hr/employee/{$employee->id}/notes/{$privateNote->id}");

    $response->assertSuccessful()
        ->assertJson([
            'success' => true,
            'message' => 'Note deleted successfully.',
        ]);

    expect(EmployeeNote::find($privateNote->id))->toBeNull();
});

test('mixing private and public notes filters correctly for regular users', function () {
    $user = User::factory()->create();
    $user->assignRole('Employee');

    $otherUser = User::factory()->create();

    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    // Create various notes
    $publicNote = EmployeeNote::factory()->create([
        'employee_id' => $employee->id,
        'is_private' => false,
        'created_by' => $otherUser->id,
        'title' => 'Public Note',
    ]);

    $otherUserPrivateNote = EmployeeNote::factory()->private()->create([
        'employee_id' => $employee->id,
        'created_by' => $otherUser->id,
        'title' => 'Other User Private Note',
    ]);

    $myPrivateNote = EmployeeNote::factory()->private()->create([
        'employee_id' => $employee->id,
        'created_by' => $user->id,
        'title' => 'My Private Note',
    ]);

    $myPublicNote = EmployeeNote::factory()->create([
        'employee_id' => $employee->id,
        'is_private' => false,
        'created_by' => $user->id,
        'title' => 'My Public Note',
    ]);

    $response = $this->actingAs($user)
        ->getJson("/dashboard/hr/employee/{$employee->id}/notes");

    $response->assertSuccessful();

    $noteIds = collect($response->json('notes'))->pluck('id')->toArray();

    // Should see: public notes and own private notes
    expect($noteIds)->toContain($publicNote->id);
    expect($noteIds)->toContain($myPrivateNote->id);
    expect($noteIds)->toContain($myPublicNote->id);

    // Should NOT see: other user's private notes
    expect($noteIds)->not->toContain($otherUserPrivateNote->id);
});
