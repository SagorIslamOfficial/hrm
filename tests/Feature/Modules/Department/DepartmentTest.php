<?php

use App\Modules\Department\Models\Department;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('can create a department', function () {
    $department = Department::factory()->create();

    expect($department)->toBeInstanceOf(Department::class);
    expect($department->name)->toBeString();
    expect($department->description)->toBeString();
});

it('can update a department', function () {
    $department = Department::factory()->create();
    $newName = 'Updated Department Name';

    $department->update(['name' => $newName]);

    expect($department->fresh()->name)->toBe($newName);
});

it('can delete a department', function () {
    $department = Department::factory()->create();

    $department->delete();

    expect(Department::find($department->id))->toBeNull();
});

it('can get employee count for department', function () {
    $department = Department::factory()->create();

    expect($department->employee_count)->toBeInt();
    expect($department->employee_count)->toBe(0);
});

it('belongs to a manager', function () {
    $department = Department::factory()->create();

    expect($department->manager)->toBeNull(); // No manager assigned by default
});
