<?php

use App\Modules\Department\Models\Designation;
use App\Modules\Department\Services\DesignationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Ensure roles exist for the policy and middleware checks
    Role::firstOrCreate(['name' => 'Admin']);
    Role::firstOrCreate(['name' => 'HR']);
    Role::firstOrCreate(['name' => 'Manager']);
});

it('performs full designation lifecycle via service', function () {
    $service = app(DesignationService::class);

    $data = [
        'title' => 'Senior Developer',
        'code' => 'SD001',
        'description' => 'Senior software developer position',
        'is_active' => true,
    ];

    // Create
    $designation = $service->createDesignation($data);

    expect($designation)->not->toBeNull();
    expect(Designation::count())->toBe(1);
    expect($designation->title)->toBe('Senior Developer');
    expect($designation->code)->toBe('SD001');
    expect($designation->is_active)->toBeTrue();

    // Stats
    $stats = $service->getDesignationStats($designation->id);
    expect($stats['id'])->toBe($designation->id);
    expect($stats['title'])->toBe($designation->title);
    expect($stats['code'])->toBe($designation->code);
    expect($stats['employee_count'])->toBe(0);
    expect($stats['is_active'])->toBeTrue();

    // Update
    $service->updateDesignation($designation->id, ['title' => 'Lead Developer']);
    $designation->refresh();
    expect($designation->title)->toBe('Lead Developer');

    // Soft delete
    $service->deleteDesignation($designation->id);
    expect(Designation::find($designation->id))->toBeNull();
    expect(Designation::withTrashed()->find($designation->id))->not->toBeNull();

    // Restore
    $service->restoreDesignation($designation->id);
    expect(Designation::find($designation->id))->not->toBeNull();

    // Force delete
    $service->forceDeleteDesignation($designation->id);
    expect(Designation::withTrashed()->find($designation->id))->toBeNull();
});

it('can get designations by department', function () {
    $service = app(DesignationService::class);

    // Create department
    $department = \App\Modules\Department\Models\Department::factory()->create();

    // Create designations
    $designation1 = $service->createDesignation([
        'title' => 'Developer',
        'code' => 'DEV001',
        'department_id' => $department->id,
        'is_active' => true,
    ]);

    $designation2 = $service->createDesignation([
        'title' => 'Designer',
        'code' => 'DES001',
        'department_id' => $department->id,
        'is_active' => true,
    ]);

    $designation3 = $service->createDesignation([
        'title' => 'Manager',
        'code' => 'MGR001',
        'is_active' => true, // No department
    ]);

    // Get designations by department
    $departmentDesignations = $service->getDesignationsByDepartment($department->id);

    expect($departmentDesignations)->toHaveCount(2);
    expect($departmentDesignations->pluck('id'))->toContain($designation1->id, $designation2->id);
    expect($departmentDesignations->pluck('id'))->not->toContain($designation3->id);
});

it('can get active designations', function () {
    $service = app(DesignationService::class);

    // Create designations
    $activeDesignation = $service->createDesignation([
        'title' => 'Active Developer',
        'code' => 'ACT001',
        'is_active' => true,
    ]);

    $inactiveDesignation = $service->createDesignation([
        'title' => 'Inactive Developer',
        'code' => 'INA001',
        'is_active' => false,
    ]);

    // Get active designations
    $activeDesignations = $service->getActiveDesignations();

    expect($activeDesignations)->toHaveCount(1);
    expect($activeDesignations->first()->id)->toBe($activeDesignation->id);
    expect($activeDesignations->pluck('id'))->not->toContain($inactiveDesignation->id);
});
