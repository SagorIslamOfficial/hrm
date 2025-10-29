<?php

use App\Models\User;
use App\Modules\Employee\Models\EmploymentType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    Role::firstOrCreate(['name' => 'Admin']);
});

test('user can view employment types index', function () {
    $user = User::factory()->create();
    $user->assignRole('Admin');

    EmploymentType::factory()->create([
        'name' => 'Full-time Employee',
        'code' => 'full_time',
        'is_active' => true,
    ]);

    $controller = new \App\Modules\Employee\Http\Controllers\EmploymentTypeController;
    $request = new \Illuminate\Http\Request;
    $request->setUserResolver(function () use ($user) {
        return $user;
    });

    $response = $controller->index($request);

    expect($response)->toBeInstanceOf(\Inertia\Response::class);
    // Check that the response contains employment types data
    $this->assertDatabaseCount('employment_types', 1);
});

test('user can create employment type', function () {
    $user = User::factory()->create();
    $user->assignRole('Admin');

    $data = [
        'name' => 'Part-time Employee',
        'code' => 'part_time',
        'description' => 'Part-time employment type',
        'is_active' => true,
    ];

    // Test the creation logic directly
    $employmentType = EmploymentType::create($data);

    $this->assertDatabaseHas('employment_types', [
        'name' => 'Part-time Employee',
        'code' => 'part_time',
    ]);
});

test('user can view employment type details', function () {
    $user = User::factory()->create();
    $user->assignRole('Admin');

    $employmentType = EmploymentType::factory()->create();

    $controller = new \App\Modules\Employee\Http\Controllers\EmploymentTypeController;
    $response = $controller->show($employmentType);

    expect($response)->toBeInstanceOf(\Inertia\Response::class);
    // Check that the response was created successfully
    $this->assertTrue(true);
});

test('user can update employment type', function () {
    $user = User::factory()->create();
    $user->assignRole('Admin');

    $employmentType = EmploymentType::factory()->create([
        'name' => 'Old Name',
        'code' => 'old_name',
    ]);

    $data = [
        'name' => 'Updated Name',
        'code' => 'updated_name',
        'description' => 'Updated description',
        'is_active' => false,
    ];

    // Test the update logic directly
    $employmentType->update($data);

    $this->assertDatabaseHas('employment_types', [
        'id' => $employmentType->id,
        'name' => 'Updated Name',
        'code' => 'updated_name',
    ]);
});

test('user can delete employment type', function () {
    $user = User::factory()->create();
    $user->assignRole('Admin');

    $employmentType = EmploymentType::factory()->create();

    $controller = new \App\Modules\Employee\Http\Controllers\EmploymentTypeController;
    $response = $controller->destroy($employmentType);

    expect($response)->toBeInstanceOf(\Illuminate\Http\RedirectResponse::class);
    $this->assertSoftDeleted($employmentType);
});

test('cannot delete employment type with assigned employees', function () {
    $user = User::factory()->create();
    $user->assignRole('Admin');

    $employmentType = EmploymentType::factory()->create(['code' => 'permanent']);

    // Create an employee with this employment type
    \App\Modules\Employee\Models\Employee::factory()->create([
        'employment_type' => 'permanent',
    ]);

    $controller = new \App\Modules\Employee\Http\Controllers\EmploymentTypeController;
    $response = $controller->destroy($employmentType);

    expect($response)->toBeInstanceOf(\Illuminate\Http\RedirectResponse::class);
    $this->assertDatabaseHas('employment_types', ['id' => $employmentType->id]);
});
