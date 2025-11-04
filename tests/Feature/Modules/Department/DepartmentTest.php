<?php

use App\Models\User;
use App\Modules\Department\Models\Department;
use App\Modules\Department\Services\DepartmentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Ensure roles exist for the policy and middleware checks
    Role::firstOrCreate(['name' => 'Admin']);
    Role::firstOrCreate(['name' => 'HR']);
    Role::firstOrCreate(['name' => 'Manager']);
});

it('performs full department lifecycle via service', function () {
    $service = app(DepartmentService::class);

    $data = [
        'name' => 'Test Department',
        'code' => 'TST001',
        'description' => 'Department for testing',
        'budget' => 10000.50,
        'location' => 'Head Office',
        'status' => 'active',
        'is_active' => true,
    ];

    // Create
    $department = $service->createDepartment($data);

    expect($department)->not->toBeNull();
    expect(Department::count())->toBe(1);

    // Stats
    $stats = $service->getDepartmentStats($department->id);
    expect($stats['id'])->toBe($department->id);
    expect($stats['name'])->toBe($department->name);
    expect($stats['employee_count'])->toBe(0);
    expect((float) $stats['budget'])->toBe(10000.50);

    // Update
    $service->updateDepartment($department->id, ['name' => 'Renamed Department']);
    $department->refresh();
    expect($department->name)->toBe('Renamed Department');

    // Soft delete
    $service->deleteDepartment($department->id);
    expect(Department::find($department->id))->toBeNull();
    expect(Department::withTrashed()->where('id', $department->id)->exists())->toBeTrue();

    // Restore
    $service->restoreDepartment($department->id);
    expect(Department::find($department->id))->not->toBeNull();

    // Force delete
    $service->deleteDepartment($department->id);
    $service->forceDeleteDepartment($department->id);
    expect(Department::withTrashed()->where('id', $department->id)->exists())->toBeFalse();
});

it('can create, update, delete and inspect department model directly', function () {
    $department = Department::factory()->create();

    expect($department)->toBeInstanceOf(Department::class);
    expect($department->name)->toBeString();
    expect($department->description)->toBeString();

    // Update
    $newName = 'Updated Department Name';
    $department->update(['name' => $newName]);
    expect($department->fresh()->name)->toBe($newName);

    // Delete
    $department->delete();
    expect(Department::find($department->id))->toBeNull();

    // Employee count and manager relation
    $dept = Department::factory()->create();
    expect($dept->employee_count)->toBeInt();
    expect($dept->employee_count)->toBe(0);
    expect($dept->manager)->toBeNull();
});

it('prevents non-admin from restoring a department (policy)', function () {
    $department = Department::factory()->create();
    $department->delete();

    $hr = User::factory()->create();
    $hr->assignRole('HR');

    $this->actingAs($hr)
        ->post(route('departments.restore', $department->id))
        ->assertForbidden();

    // Still trashed
    expect(Department::withTrashed()->where('id', $department->id)->exists())->toBeTrue();
});

it('allows admin to restore a department', function () {
    $department = Department::factory()->create();
    $department->delete();

    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $this->actingAs($admin)
        ->post(route('departments.restore', $department->id))
        ->assertRedirect(route('departments.index'));

    expect(Department::find($department->id))->not->toBeNull();
});

it('prevents non-admin from force deleting a department (policy)', function () {
    $department = Department::factory()->create();
    $department->delete();

    $hr = User::factory()->create();
    $hr->assignRole('HR');

    $this->actingAs($hr)
        ->delete(route('departments.forceDelete', $department->id))
        ->assertForbidden();

    // Still exists as trashed
    expect(Department::withTrashed()->where('id', $department->id)->exists())->toBeTrue();
});

it('allows admin to force delete a department', function () {
    $department = Department::factory()->create();
    $department->delete();

    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $this->actingAs($admin)
        ->delete(route('departments.forceDelete', $department->id))
        ->assertRedirect(route('departments.index'));

    expect(Department::withTrashed()->where('id', $department->id)->exists())->toBeFalse();
});

it('shows department with notes including user data in Inertia response', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $department = Department::factory()->create();
    $user = User::factory()->create(['name' => 'John Doe']);

    // Create a note with user
    $department->notes()->create([
        'title' => 'Test Note Title',
        'created_by' => $user->id,
        'updated_by' => $user->id,
        'note' => 'Test note',
        'category' => 'general',
    ]);

    $this->actingAs($admin)
        ->get(route('departments.show', $department->id))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('modules/department/show')
            ->has('department.notes', 1)
            ->where('department.notes.0.creator.name', 'John Doe')
            ->where('department.notes.0.note', 'Test note')
            ->where('department.notes.0.category', 'general')
        );
});
