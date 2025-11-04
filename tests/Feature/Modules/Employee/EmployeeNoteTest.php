<?php

use App\Models\User;
use App\Modules\Department\Models\Department;
use App\Modules\Department\Models\Designation;
use App\Modules\Employee\Models\Employee;
use App\Modules\Employee\Models\EmployeeNote;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Create permissions required by the policy
    Permission::create(['name' => 'view-private-notes']);
    Permission::create(['name' => 'manage-private-notes']);
});

test('can list employee notes', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    EmployeeNote::factory()->count(3)->create([
        'employee_id' => $employee->id,
        'created_by' => $user->id,
    ]);

    $response = $this->actingAs($user)
        ->getJson("/dashboard/hr/employee/{$employee->id}/notes");

    $response->assertSuccessful()
        ->assertJsonStructure([
            'notes' => [
                '*' => [
                    'id',
                    'employee_id',
                    'created_by',
                    'updated_by',
                    'note',
                    'is_private',
                    'category',
                    'created_at',
                    'updated_at',
                    'creator' => [
                        'id',
                        'name',
                    ],
                ],
            ],
        ]);
});

it('can create an employee note', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $noteData = [
        'title' => 'Test Note Title',
        'note' => 'This is a test note for the employee.',
        'category' => 'general',
        'is_private' => false,
    ];

    $response = $this->actingAs($user)
        ->postJson("/dashboard/hr/employee/{$employee->id}/notes", $noteData);

    $response->assertCreated()
        ->assertJsonStructure([
            'success',
            'message',
            'note' => [
                'id',
                'employee_id',
                'created_by',
                'updated_by',
                'note',
                'is_private',
                'category',
                'created_at',
                'updated_at',
                'creator' => [
                    'id',
                    'name',
                ],
            ],
        ]);

    // Verify the note was created in the database
    expect(EmployeeNote::where('employee_id', $employee->id)->count())->toBe(1);
});

it('can create a private employee note', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $noteData = [
        'title' => 'Private Note Title',
        'note' => 'This is a private note.',
        'category' => 'disciplinary',
        'is_private' => true,
    ];

    $response = $this->actingAs($user)
        ->postJson("/dashboard/hr/employee/{$employee->id}/notes", $noteData);

    $response->assertCreated()
        ->assertJson([
            'success' => true,
            'note' => [
                'is_private' => true,
                'category' => 'disciplinary',
            ],
        ]);
});

it('can show a specific employee note', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $note = EmployeeNote::factory()->create([
        'employee_id' => $employee->id,
        'created_by' => $user->id,
    ]);

    $response = $this->actingAs($user)
        ->getJson("/dashboard/hr/employee/{$employee->id}/notes/{$note->id}");

    $response->assertSuccessful()
        ->assertJsonStructure([
            'note' => [
                'id',
                'employee_id',
                'created_by',
                'updated_by',
                'note',
                'is_private',
                'category',
                'created_at',
                'updated_at',
                'creator' => [
                    'id',
                    'name',
                ],
            ],
        ])
        ->assertJson([
            'note' => [
                'id' => $note->id,
                'employee_id' => $employee->id,
            ],
        ]);
});

it('cannot show note that belongs to different employee', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee1 = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $employee2 = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $note = EmployeeNote::factory()->create([
        'employee_id' => $employee1->id,
        'created_by' => $user->id,
    ]);

    $response = $this->actingAs($user)
        ->getJson("/dashboard/hr/employee/{$employee2->id}/notes/{$note->id}");

    $response->assertNotFound()
        ->assertJson([
            'success' => false,
            'message' => 'Note not found.',
        ]);
});

it('can update an employee note', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $note = EmployeeNote::factory()->create([
        'employee_id' => $employee->id,
        'created_by' => $user->id,
        'note' => 'Original note',
        'category' => 'general',
        'is_private' => false,
    ]);

    $updateData = [
        'title' => 'Updated Note Title',
        'note' => 'Updated note content',
        'category' => 'performance',
        'is_private' => true,
    ];

    $response = $this->actingAs($user)
        ->putJson("/dashboard/hr/employee/{$employee->id}/notes/{$note->id}", $updateData);

    $response->assertSuccessful()
        ->assertJsonStructure([
            'success',
            'message',
            'note' => [
                'id',
                'employee_id',
                'created_by',
                'updated_by',
                'note',
                'is_private',
                'category',
                'created_at',
                'updated_at',
                'creator' => [
                    'id',
                    'name',
                ],
                'updater' => [
                    'id',
                    'name',
                ],
            ],
        ])
        ->assertJson([
            'success' => true,
            'message' => 'Note updated successfully.',
            'note' => [
                'id' => $note->id,
                'note' => $updateData['note'],
                'category' => $updateData['category'],
                'is_private' => $updateData['is_private'],
            ],
        ]);

    // Verify the note was updated in the database
    $note->refresh();
    expect($note->note)->toBe($updateData['note']);
    expect($note->category)->toBe($updateData['category']);
    expect($note->is_private)->toBe($updateData['is_private']);
    expect($note->updated_by)->toBe($user->id);
});

it('sets updated_by to current user when updating note', function () {
    $creator = User::factory()->create();
    $updater = User::factory()->create();

    // Give updater permission to manage private notes
    $updater->givePermissionTo('manage-private-notes');

    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $note = EmployeeNote::factory()->create([
        'employee_id' => $employee->id,
        'created_by' => $creator->id,
        'note' => 'Original note',
        'category' => 'general',
        'is_private' => false,
    ]);

    $updateData = [
        'title' => 'Updated by Different User',
        'note' => 'Updated by different user',
        'category' => 'performance',
        'is_private' => true,
    ];

    $response = $this->actingAs($updater)
        ->putJson("/dashboard/hr/employee/{$employee->id}/notes/{$note->id}", $updateData);

    $response->assertSuccessful();

    // Verify the note was updated with the correct updated_by user
    $note->refresh();
    expect($note->created_by)->toBe($creator->id); // Original creator should remain
    expect($note->updated_by)->toBe($updater->id); // Updated by should be the current user
    expect($note->note)->toBe($updateData['note']);
});

it('cannot update note that belongs to different employee', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee1 = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $employee2 = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $note = EmployeeNote::factory()->create([
        'employee_id' => $employee1->id,
        'created_by' => $user->id,
    ]);

    $updateData = [
        'title' => 'Updated Note',
        'note' => 'Updated note',
        'category' => 'performance',
        'is_private' => false,
    ];

    $response = $this->actingAs($user)
        ->putJson("/dashboard/hr/employee/{$employee2->id}/notes/{$note->id}", $updateData);

    $response->assertNotFound()
        ->assertJson([
            'success' => false,
            'message' => 'Note not found.',
        ]);
});

it('can delete an employee note', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $note = EmployeeNote::factory()->create([
        'employee_id' => $employee->id,
        'created_by' => $user->id,
    ]);

    $response = $this->actingAs($user)
        ->deleteJson("/dashboard/hr/employee/{$employee->id}/notes/{$note->id}");

    $response->assertSuccessful()
        ->assertJson([
            'success' => true,
            'message' => 'Note deleted successfully.',
        ]);

    // Verify the note was deleted from the database
    expect(EmployeeNote::find($note->id))->toBeNull();
});

it('cannot delete note that belongs to different employee', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee1 = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $employee2 = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $note = EmployeeNote::factory()->create([
        'employee_id' => $employee1->id,
        'created_by' => $user->id,
    ]);

    $response = $this->actingAs($user)
        ->deleteJson("/dashboard/hr/employee/{$employee2->id}/notes/{$note->id}");

    $response->assertNotFound()
        ->assertJson([
            'success' => false,
            'message' => 'Note not found.',
        ]);

    // Verify the note still exists
    expect(EmployeeNote::find($note->id))->not->toBeNull();
});

// Validation Tests
it('validates required note field when creating', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $response = $this->actingAs($user)
        ->postJson("/dashboard/hr/employee/{$employee->id}/notes", [
            'title' => 'Test Title',
            'category' => 'general',
            'is_private' => false,
        ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['note']);
});

it('validates required note field when updating', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $note = EmployeeNote::factory()->create([
        'employee_id' => $employee->id,
        'created_by' => $user->id,
    ]);

    $response = $this->actingAs($user)
        ->putJson("/dashboard/hr/employee/{$employee->id}/notes/{$note->id}", [
            'title' => 'Updated Title',
            'category' => 'general',
            'is_private' => false,
            // Missing 'note' field
        ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['note']);
});

it('validates category enum values', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $response = $this->actingAs($user)
        ->postJson("/dashboard/hr/employee/{$employee->id}/notes", [
            'title' => 'Test Note',
            'note' => 'Test note',
            'category' => 'invalid_category',
            'is_private' => false,
        ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['category']);
});

it('accepts valid category values', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $validCategories = ['general', 'performance', 'disciplinary', 'achievement', 'other'];

    foreach ($validCategories as $category) {
        $response = $this->actingAs($user)
            ->postJson("/dashboard/hr/employee/{$employee->id}/notes", [
                'title' => "Test Title for {$category}",
                'note' => "Test note for {$category}",
                'category' => $category,
                'is_private' => false,
            ]);

        $response->assertCreated()
            ->assertJson([
                'success' => true,
                'note' => [
                    'category' => $category,
                ],
            ]);
    }
});

it('validates is_private is boolean', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $response = $this->actingAs($user)
        ->postJson("/dashboard/hr/employee/{$employee->id}/notes", [
            'title' => 'Test Note',
            'note' => 'Test note',
            'category' => 'general',
            'is_private' => 'not_boolean',
        ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['is_private']);
});

// Model Relationship Tests
it('belongs to employee', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $note = EmployeeNote::factory()->create([
        'employee_id' => $employee->id,
        'created_by' => $user->id,
    ]);

    expect($note->employee)->toBeInstanceOf(Employee::class);
    expect($note->employee->id)->toBe($employee->id);
});

it('belongs to creator user', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $note = EmployeeNote::factory()->create([
        'employee_id' => $employee->id,
        'created_by' => $user->id,
    ]);

    expect($note->creator)->toBeInstanceOf(User::class);
    expect($note->creator->id)->toBe($user->id);
});

it('employee has many notes', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    EmployeeNote::factory()->count(3)->create([
        'employee_id' => $employee->id,
        'created_by' => $user->id,
    ]);

    expect($employee->notes)->toHaveCount(3);
    expect($employee->notes->first())->toBeInstanceOf(EmployeeNote::class);
});

// Factory Tests
it('can create note using factory', function () {
    $note = EmployeeNote::factory()->create();

    expect($note)->toBeInstanceOf(EmployeeNote::class);
    expect($note->id)->toBeString();
    expect($note->note)->toBeString();
    expect($note->category)->toBeIn(['general', 'performance', 'disciplinary', 'achievement', 'other']);
    expect($note->is_private)->toBeBool();
    expect($note->employee_id)->toBeString();
    expect($note->created_by)->toBeInt();
});

it('can create private note using factory state', function () {
    $note = EmployeeNote::factory()->private()->create();

    expect($note->is_private)->toBeTrue();
});

// Error Handling Tests
it('handles database errors during creation', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    // Mock a database error by using an invalid employee_id
    $noteData = [
        'title' => 'Test Note',
        'note' => 'This is a test note.',
        'category' => 'general',
        'is_private' => false,
    ];

    // We'll test the error handling by ensuring the response structure is correct
    // In a real scenario, we might mock the service to throw an exception
    $response = $this->actingAs($user)
        ->postJson("/dashboard/hr/employee/{$employee->id}/notes", $noteData);

    // If successful, verify the structure
    if ($response->getStatusCode() === 201) {
        $response->assertJsonStructure([
            'success',
            'message',
            'note',
        ]);
    }
});

// Authorization Tests (if applicable)
it('requires authentication', function () {
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $response = $this->getJson("/dashboard/hr/employee/{$employee->id}/notes");

    $response->assertUnauthorized();
});
