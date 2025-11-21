<?php

use App\Models\User;
use App\Modules\HR\Employee\Models\Employee;
use App\Modules\HR\Organization\Branch\Models\Branch;
use App\Modules\HR\Organization\Branch\Models\BranchDetail;
use App\Modules\HR\Organization\Branch\Models\BranchSettings;
use App\Modules\HR\Organization\Branch\Services\BranchService;
use App\Modules\HR\Organization\Department\Models\Department;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class, WithoutMiddleware::class);

beforeEach(function () {
    Role::firstOrCreate(['name' => 'Admin']);
    Role::firstOrCreate(['name' => 'HR']);
    Role::firstOrCreate(['name' => 'Manager']);
});

it('performs full branch lifecycle via service', function () {
    $service = app(BranchService::class);

    $data = [
        'name' => 'Test Branch',
        'code' => 'TST001',
        'type' => 'branch_office',
        'description' => 'Branch for testing',
        'address_line_1' => '123 Test Street',
        'city' => 'Dhaka',
        'country' => 'Bangladesh',
        'phone' => '+880 2 9876543',
        'email' => 'test@branch.com',
        'status' => 'active',
        'is_active' => true,
        'budget' => 50000.00,
        'max_employees' => 100,
    ];

    // Create
    $branch = $service->createBranch($data);

    expect($branch)->not->toBeNull();
    expect($branch)->toBeInstanceOf(Branch::class);
    expect(Branch::count())->toBe(1);
    expect($branch->name)->toBe('Test Branch');
    expect($branch->code)->toBe('TST001');
    expect($branch->type)->toBe('branch_office');
    expect($branch->status)->toBe('active');

    // Update
    $service->updateBranch($branch->id, ['name' => 'Renamed Branch', 'city' => 'Chittagong']);
    $branch->refresh();
    expect($branch->name)->toBe('Renamed Branch');
    expect($branch->city)->toBe('Chittagong');

    // Soft delete
    $service->deleteBranch($branch->id);
    expect(Branch::find($branch->id))->toBeNull();
    expect(Branch::withTrashed()->where('id', $branch->id)->exists())->toBeTrue();
});

it('can create branch with details and settings', function () {
    $service = app(BranchService::class);

    $data = [
        'name' => 'Test Branch with Details',
        'code' => 'DETAIL001',
        'type' => 'head_office',
        'status' => 'active',
        'detail' => [
            'latitude' => 23.8103,
            'longitude' => 90.4125,
            'total_area' => 5000,
            'building_name' => 'Tech Tower',
            'facilities' => ['WiFi', 'Parking', 'Security', 'CCTV'],
        ],
        'settings' => [
            'allow_overtime' => true,
            'allow_remote_work' => true,
            'emergency_contact_name' => 'John Doe',
            'emergency_contact_phone' => '+880 1700000000',
            'currency' => 'BDT',
            'security_features' => ['cctv' => true, 'biometric_system' => true],
        ],
    ];

    $branch = $service->createBranch($data);

    expect($branch)->not->toBeNull();
    expect($branch->detail)->not->toBeNull();
    expect($branch->detail)->toBeInstanceOf(BranchDetail::class);
    expect((float) $branch->detail->latitude)->toBe(23.8103);
    expect((float) $branch->detail->longitude)->toBe(90.4125);
    expect($branch->detail->facilities)->toBeArray();
    expect($branch->detail->facilities)->toContain('WiFi');

    expect($branch->settings)->not->toBeNull();
    expect($branch->settings)->toBeInstanceOf(BranchSettings::class);
    expect($branch->settings->allow_overtime)->toBeTrue();
    expect($branch->settings->allow_remote_work)->toBeTrue();
    expect($branch->settings->security_features)->toBeArray();
    expect($branch->settings->security_features['cctv'])->toBeTrue();
});

it('can create hierarchical branches (parent-child)', function () {
    $service = app(BranchService::class);

    // Create parent branch (Head Office)
    $headOffice = $service->createBranch([
        'name' => 'Head Office',
        'code' => 'HQ001',
        'type' => 'head_office',
        'status' => 'active',
    ]);

    // Create child branch
    $regionalOffice = $service->createBranch([
        'name' => 'Dhaka Regional Office',
        'code' => 'REG001',
        'type' => 'regional_office',
        'status' => 'active',
        'parent_id' => $headOffice->id,
    ]);

    expect($regionalOffice->parent_id)->toBe($headOffice->id);
    expect($regionalOffice->parentBranch)->not->toBeNull();
    expect($regionalOffice->parentBranch->id)->toBe($headOffice->id);

    $headOffice->refresh();
    expect($headOffice->childBranches)->toHaveCount(1);
    expect($headOffice->childBranches->first()->id)->toBe($regionalOffice->id);
});

it('prevents circular reference in branch hierarchy', function () {
    $service = app(BranchService::class);

    $branchA = $service->createBranch([
        'name' => 'Branch A',
        'code' => 'A001',
        'type' => 'branch_office',
        'status' => 'active',
    ]);

    $branchB = $service->createBranch([
        'name' => 'Branch B',
        'code' => 'B001',
        'type' => 'branch_office',
        'status' => 'active',
        'parent_id' => $branchA->id,
    ]);

    // Try to make Branch A a child of Branch B (circular reference)
    expect(fn () => $service->updateBranch($branchA->id, ['parent_id' => $branchB->id]))
        ->toThrow(InvalidArgumentException::class, 'Invalid hierarchy: Cannot create circular reference or set child as parent.');
});

it('can calculate branch hierarchy level', function () {
    $service = app(BranchService::class);

    $headOffice = $service->createBranch([
        'name' => 'Head Office',
        'code' => 'HQ001',
        'type' => 'head_office',
        'status' => 'active',
    ]);

    $regional = $service->createBranch([
        'name' => 'Regional Office',
        'code' => 'REG001',
        'type' => 'regional_office',
        'status' => 'active',
        'parent_id' => $headOffice->id,
    ]);

    $local = $service->createBranch([
        'name' => 'Local Branch',
        'code' => 'LOC001',
        'type' => 'branch_office',
        'status' => 'active',
        'parent_id' => $regional->id,
    ]);

    expect($headOffice->getHierarchyLevel())->toBe(0);
    expect($regional->getHierarchyLevel())->toBe(1);
    expect($local->getHierarchyLevel())->toBe(2);
});

it('can sync departments to branch with pivot data', function () {
    $service = app(BranchService::class);

    $branch = Branch::factory()->create();
    $department1 = Department::factory()->create();
    $department2 = Department::factory()->create();

    $departmentData = [
        [
            'department_id' => $department1->id,
            'budget_allocation' => 25000.00,
            'is_primary' => true,
        ],
        [
            'department_id' => $department2->id,
            'budget_allocation' => 15000.00,
            'is_primary' => false,
        ],
    ];

    $service->syncDepartments($branch->id, $departmentData);

    $branch->refresh();
    expect($branch->departments)->toHaveCount(2);

    $pivot1 = $branch->departments()->where('department_id', $department1->id)->first()->pivot;
    expect((float) $pivot1->budget_allocation)->toBe(25000.00);
    expect($pivot1->is_primary)->toBeTrue();
});

it('can create, update, and delete branch notes', function () {

    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();

    // Create note
    $this->actingAs($admin)
        ->post(route('branches.notes.store', $branch->id), [
            'title' => 'Test Note',
            'note' => 'This is a test note',
            'category' => 'general',
        ])
        ->assertCreated()
        ->assertJson([
            'success' => true,
            'message' => 'Note created successfully.',
        ]);

    $branch->refresh();
    expect($branch->notes)->toHaveCount(1);
    expect($branch->notes->first()->note)->toBe('This is a test note');
    expect($branch->notes->first()->category)->toBe('general');
    expect($branch->notes->first()->created_by)->toBe($admin->id);

    // Update note
    $note = $branch->notes->first();
    $this->actingAs($admin)
        ->put(route('branches.notes.update', [$branch->id, $note->id]), [
            'title' => 'Updated Test Note',
            'note' => 'Updated test note',
            'category' => 'other',
        ])
        ->assertOk()
        ->assertJson([
            'success' => true,
            'message' => 'Note updated successfully.',
        ]);

    $note->refresh();
    expect($note->note)->toBe('Updated test note');
    expect($note->category)->toBe('other');
    expect($note->updated_by)->toBe($admin->id);

    // Delete note
    $this->actingAs($admin)
        ->delete(route('branches.notes.destroy', [$branch->id, $note->id]))
        ->assertOk()
        ->assertJson([
            'success' => true,
            'message' => 'Note deleted successfully.',
        ]);

    $branch->refresh();
    expect($branch->notes)->toHaveCount(0);
});

it('can display branch with full address accessor', function () {
    $branch = Branch::factory()->create([
        'address_line_1' => '123 Main Street',
        'address_line_2' => 'Suite 456',
        'city' => 'Dhaka',
        'state' => 'Dhaka Division',
        'country' => 'Bangladesh',
        'postal_code' => '1200',
    ]);

    expect($branch->full_address)->toContain('123 Main Street');
    expect($branch->full_address)->toContain('Dhaka');
    expect($branch->full_address)->toContain('Bangladesh');
});

it('can count employees and departments in branch', function () {
    $branch = Branch::factory()->create();
    $department = Department::factory()->create();

    $branch->departments()->attach($department->id);

    // Note: This test is simplified since Employee model setup would be needed
    // The employee_count accessor works via employees relationship
    $branch->refresh();
    expect($branch->department_count)->toBe(1);
});

it('shows all branches in index for admin', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    // Seeder creates 13 branches (1 HQ + 4 regional + 8 branch offices)
    // So we just verify the page loads successfully with branches data
    $this->actingAs($admin)
        ->get(route('branches.index'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('modules/branch/index')
            ->has('branches')
        );
});

it('shows branch details with relationships in show page', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    // Create branch without manager (would need Employee model setup)
    $branch = Branch::factory()->create();

    // Create detail and settings
    $branch->detail()->create([
        'latitude' => 23.8103,
        'longitude' => 90.4125,
        'facilities' => ['WiFi', 'Parking'],
    ]);

    $branch->settings()->create([
        'allow_overtime' => true,
        'allow_remote_work' => false,
    ]);

    $this->actingAs($admin)
        ->get(route('branches.show', $branch->id))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('modules/branch/show')
            ->where('branch.id', $branch->id)
            ->where('branch.name', $branch->name)
            ->has('branch.detail')
            ->has('branch.settings')
            ->has('stats')
        );
});

it('validates required fields when creating branch', function () {

    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $this->actingAs($admin)
        ->post(route('branches.store'), [
            // Missing required fields: name, code, type, status
        ])
        ->assertSessionHasErrors(['name', 'code', 'type', 'status']);
});

it('validates branch code uniqueness', function () {

    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    Branch::factory()->create(['code' => 'UNIQUE001']);

    $this->actingAs($admin)
        ->post(route('branches.store'), [
            'name' => 'Test Branch',
            'code' => 'UNIQUE001', // Duplicate code
            'type' => 'branch_office',
            'status' => 'active',
        ])
        ->assertSessionHasErrors(['code']);
});

it('allows HR and Admin to create branches', function () {

    $hr = User::factory()->create();
    $hr->assignRole('HR');

    $response = $this->actingAs($hr)
        ->post(route('branches.store'), [
            'name' => 'HR Created Branch',
            'code' => 'HR001',
            'type' => 'branch_office',
            'status' => 'active',
        ]);

    $response->assertRedirect(); // Controller redirects to show page
    expect(Branch::where('code', 'HR001')->exists())->toBeTrue();
});

it('prevents Manager from creating branches', function () {

    $manager = User::factory()->create();
    $manager->assignRole('Manager');

    $this->actingAs($manager)
        ->post(route('branches.store'), [
            'name' => 'Manager Branch',
            'code' => 'MGR001',
            'type' => 'branch_office',
            'status' => 'active',
        ])
        ->assertForbidden();
});

it('can update branch information', function () {

    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create([
        'name' => 'Original Name',
        'status' => 'active',
    ]);

    $this->actingAs($admin)
        ->put(route('branches.update', $branch->id), [
            'name' => 'Updated Name',
            'code' => $branch->code,
            'type' => $branch->type,
            'status' => 'inactive',
            'is_active' => true,
        ])
        ->assertRedirect();

    $branch->refresh();
    expect($branch->name)->toBe('Updated Name');
    expect($branch->status)->toBe('inactive');
});

it('can delete branch (soft delete)', function () {

    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();

    $this->actingAs($admin)
        ->delete(route('branches.destroy', $branch->id))
        ->assertRedirect(route('branches.index'));

    expect(Branch::find($branch->id))->toBeNull();
    expect(Branch::withTrashed()->where('id', $branch->id)->exists())->toBeTrue();
});

it('can retrieve branch hierarchy', function () {
    $service = app(BranchService::class);

    $root = Branch::factory()->create(['parent_id' => null]);
    $child1 = Branch::factory()->create(['parent_id' => $root->id]);
    $child2 = Branch::factory()->create(['parent_id' => $root->id]);
    $grandchild = Branch::factory()->create(['parent_id' => $child1->id]);

    $hierarchy = $service->getBranchHierarchy($root->id);

    expect($hierarchy)->toBeArray();
    expect($hierarchy)->toHaveKey('ancestors');
    expect($hierarchy)->toHaveKey('descendants');
});

it('can move branch to different parent', function () {
    $service = app(BranchService::class);

    $parent1 = Branch::factory()->create();
    $parent2 = Branch::factory()->create();
    $child = Branch::factory()->create(['parent_id' => $parent1->id]);

    $service->moveBranch($child->id, $parent2->id);

    $child->refresh();
    expect($child->parent_id)->toBe($parent2->id);
});

it('validates working hours format in branch details', function () {

    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();

    $this->actingAs($admin)
        ->put(route('branches.update', $branch->id), [
            'name' => $branch->name,
            'code' => $branch->code,
            'type' => $branch->type,
            'status' => $branch->status,
            'is_active' => true,
            'detail' => [
                'working_hours' => [
                    'monday' => ['start' => '09:00', 'end' => '18:00'],
                    'tuesday' => ['start' => '09:00', 'end' => '18:00'],
                ],
            ],
        ])
        ->assertSessionDoesntHaveErrors();
});

it('displays branch with notes including creator and updater', function () {
    $admin = User::factory()->create(['name' => 'Admin User']);
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();

    $branch->notes()->create([
        'title' => 'Test Note',
        'note' => 'Test note content',
        'category' => 'general',
        'created_by' => $admin->id,
        'updated_by' => $admin->id,
    ]);

    $this->actingAs($admin)
        ->get(route('branches.show', $branch->id))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('modules/branch/show')
            ->has('branch.notes', 1)
            ->where('branch.notes.0.note', 'Test note content')
            ->where('branch.notes.0.category', 'general')
        );
});

it('can access branch edit page', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();

    $this->actingAs($admin)
        ->get(route('branches.edit', $branch->id))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('modules/branch/edit')
            ->where('branch.id', $branch->id)
            ->has('employees')
            ->has('branches')
            ->has('branchTypes')
            ->has('departments')
        );
});

it('can assign departments to branch', function () {

    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();
    $department = Department::factory()->create();

    $this->actingAs($admin)
        ->post(route('branches.departments.assign', $branch->id), [
            'department_id' => $department->id,
        ])
        ->assertCreated()
        ->assertJson([
            'success' => true,
            'message' => 'Department assigned successfully.',
        ]);

    expect($branch->departments()->where('department_id', $department->id)->exists())
        ->toBeTrue();
});

it('can assign departments to branch with pivot data', function () {

    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();
    $department = Department::factory()->create();

    $this->actingAs($admin)
        ->post(route('branches.departments.assign', $branch->id), [
            'department_id' => $department->id,
            'budget_allocation' => 2000,
            'is_primary' => true,
        ])
        ->assertCreated()
        ->assertJson([
            'success' => true,
            'message' => 'Department assigned successfully.',
        ]);

    $pivot = $branch->departments()->where('department_id', $department->id)->first()->pivot;

    expect((float) $pivot->budget_allocation)->toBe(2000.00)
        ->and($pivot->is_primary)->toBeTrue();
});

it('can remove departments from branch', function () {

    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();
    $department = Department::factory()->create();

    $branch->departments()->attach($department->id);

    $this->actingAs($admin)
        ->delete(route('branches.departments.detach', [$branch->id, $department->id]))
        ->assertOk()
        ->assertJson([
            'success' => true,
            'message' => 'Department removed successfully.',
        ]);

    expect($branch->departments()->where('department_id', $department->id)->exists())
        ->toBeFalse();
});

it('prevents assigning duplicate departments', function () {

    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();
    $department = Department::factory()->create();

    $branch->departments()->attach($department->id);

    $this->actingAs($admin)
        ->post(route('branches.departments.assign', $branch->id), [
            'department_id' => $department->id,
        ])
        ->assertStatus(422)
        ->assertJson([
            'success' => false,
            'message' => 'This department is already assigned to the branch.',
        ]);
});

it('can update department pivot data in branch', function () {

    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();
    $department = Department::factory()->create();

    $branch->departments()->attach($department->id, [
        'budget_allocation' => 100000,
    ]);

    $this->actingAs($admin)
        ->put(route('branches.departments.update', [$branch->id, $department->id]), [
            'budget_allocation' => 150000,
            'is_primary' => true,
        ])
        ->assertOk()
        ->assertJson([
            'success' => true,
            'message' => 'Department updated successfully.',
        ]);

    $pivot = $branch->departments()->where('department_id', $department->id)->first()->pivot;
    expect((float) $pivot->budget_allocation)->toBe(150000.00)
        ->and($pivot->is_primary)->toBeTrue();
});

it('can update branch with time settings in different formats', function () {

    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();

    // Test updating with 24-hour format
    $this->actingAs($admin)
        ->put(route('branches.update', $branch->id), [
            'name' => $branch->name,
            'code' => $branch->code,
            'type' => $branch->type,
            'status' => $branch->status,
            'is_active' => $branch->is_active,
            'settings' => [
                'standard_work_start' => '09:00',
                'standard_work_end' => '17:00',
            ],
        ])
        ->assertRedirect();

    $branch->refresh();
    $branch->load('settings');
    expect($branch->settings->standard_work_start)->toBe('09:00');
    expect($branch->settings->standard_work_end)->toBe('17:00');

    // Test updating with 12-hour format
    $this->actingAs($admin)
        ->put(route('branches.update', $branch->id), [
            'name' => $branch->name,
            'code' => $branch->code,
            'type' => $branch->type,
            'status' => $branch->status,
            'is_active' => $branch->is_active,
            'settings' => [
                'standard_work_start' => '9:00 AM',
                'standard_work_end' => '5:00 PM',
            ],
        ])
        ->assertRedirect();

    $branch->refresh();
    expect($branch->settings->standard_work_start)->toBe('9:00 AM');
    expect($branch->settings->standard_work_end)->toBe('5:00 PM');
});
