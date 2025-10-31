<?php

use App\Models\User;
use App\Modules\Department\Models\Department;
use App\Modules\Department\Models\Designation;
use App\Modules\Employee\Models\Employee;
use App\Modules\Employee\Models\EmployeeCustomField;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('can list employee custom fields', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    EmployeeCustomField::factory()->count(3)->create([
        'employee_id' => $employee->id,
    ]);

    $response = $this->actingAs($user)
        ->getJson("/dashboard/hr/employee/{$employee->id}/custom-fields");

    $response->assertSuccessful()
        ->assertJsonStructure([
            'customFields' => [
                '*' => [
                    'id',
                    'employee_id',
                    'field_key',
                    'field_value',
                    'field_type',
                    'section',
                ],
            ],
        ])
        ->assertJsonCount(3, 'customFields');
});

test('can create a custom field', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $customFieldData = [
        'employee_id' => $employee->id,
        'field_key' => 'emergency-contact',
        'field_value' => 'John Doe - 123-456-7890',
        'field_type' => 'text',
        'section' => 'personal',
    ];

    $response = $this->actingAs($user)
        ->postJson("/dashboard/hr/employee/{$employee->id}/custom-fields", $customFieldData);

    $response->assertCreated()
        ->assertJson([
            'success' => true,
            'message' => 'Custom field created successfully.',
        ]);

    $this->assertDatabaseHas('employee_custom_fields', [
        'employee_id' => $employee->id,
        'field_key' => 'emergency-contact',
        'field_value' => 'John Doe - 123-456-7890',
    ]);
});

test('can show a specific custom field', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $customField = EmployeeCustomField::factory()->create([
        'employee_id' => $employee->id,
    ]);

    $response = $this->actingAs($user)
        ->getJson("/dashboard/hr/employee/{$employee->id}/custom-fields/{$customField->id}");

    $response->assertSuccessful()
        ->assertJson([
            'customField' => [
                'id' => $customField->id,
                'field_key' => $customField->field_key,
            ],
        ]);
});

test('cannot show custom field that belongs to different employee', function () {
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

    $customField = EmployeeCustomField::factory()->create([
        'employee_id' => $employee2->id,
    ]);

    $response = $this->actingAs($user)
        ->getJson("/dashboard/hr/employee/{$employee1->id}/custom-fields/{$customField->id}");

    $response->assertNotFound();
});

test('can update a custom field', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $customField = EmployeeCustomField::factory()->create([
        'employee_id' => $employee->id,
        'field_key' => 'blood-type',
        'field_value' => 'A+',
    ]);

    $updateData = [
        'field_value' => 'O+',
    ];

    $response = $this->actingAs($user)
        ->putJson("/dashboard/hr/employee/{$employee->id}/custom-fields/{$customField->id}", $updateData);

    $response->assertSuccessful()
        ->assertJson([
            'success' => true,
            'message' => 'Custom field updated successfully.',
        ]);

    $customField->refresh();
    expect($customField->field_value)->toBe('O+');
});

test('cannot update custom field that belongs to different employee', function () {
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

    $customField = EmployeeCustomField::factory()->create([
        'employee_id' => $employee2->id,
    ]);

    $response = $this->actingAs($user)
        ->putJson("/dashboard/hr/employee/{$employee1->id}/custom-fields/{$customField->id}", [
            'field_value' => 'Updated',
        ]);

    $response->assertNotFound();
});

test('can delete a custom field', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $customField = EmployeeCustomField::factory()->create([
        'employee_id' => $employee->id,
    ]);

    $response = $this->actingAs($user)
        ->deleteJson("/dashboard/hr/employee/{$employee->id}/custom-fields/{$customField->id}");

    $response->assertSuccessful()
        ->assertJson([
            'success' => true,
            'message' => 'Custom field deleted successfully.',
        ]);

    $this->assertDatabaseMissing('employee_custom_fields', [
        'id' => $customField->id,
    ]);
});

test('cannot delete custom field that belongs to different employee', function () {
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

    $customField = EmployeeCustomField::factory()->create([
        'employee_id' => $employee2->id,
    ]);

    $response = $this->actingAs($user)
        ->deleteJson("/dashboard/hr/employee/{$employee1->id}/custom-fields/{$customField->id}");

    $response->assertNotFound();
});

test('can sync custom fields for an employee', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    // Create some existing custom fields
    EmployeeCustomField::factory()->count(2)->create([
        'employee_id' => $employee->id,
    ]);

    $syncData = [
        'custom_fields' => [
            [
                'field_key' => 'shirt-size',
                'field_value' => 'L',
                'field_type' => 'select',
                'section' => 'personal',
            ],
            [
                'field_key' => 'parking-spot',
                'field_value' => 'A-23',
                'field_type' => 'text',
                'section' => 'other',
            ],
        ],
    ];

    $response = $this->actingAs($user)
        ->postJson("/dashboard/hr/employee/{$employee->id}/custom-fields/sync", $syncData);

    $response->assertSuccessful()
        ->assertJson([
            'success' => true,
            'message' => 'Custom fields synced successfully.',
        ]);

    // Old fields should be deleted, only new ones should exist
    expect($employee->customFields()->count())->toBe(2);
    $this->assertDatabaseHas('employee_custom_fields', [
        'employee_id' => $employee->id,
        'field_key' => 'shirt-size',
    ]);
    $this->assertDatabaseHas('employee_custom_fields', [
        'employee_id' => $employee->id,
        'field_key' => 'parking-spot',
    ]);
});

test('validates required fields when creating custom field', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $response = $this->actingAs($user)
        ->postJson("/dashboard/hr/employee/{$employee->id}/custom-fields", []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['employee_id', 'field_key', 'field_type']);
});

test('validates field_type enum values', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $response = $this->actingAs($user)
        ->postJson("/dashboard/hr/employee/{$employee->id}/custom-fields", [
            'employee_id' => $employee->id,
            'field_key' => 'test-field',
            'field_type' => 'invalid-type',
        ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['field_type']);
});

test('validates field_key format', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $response = $this->actingAs($user)
        ->postJson("/dashboard/hr/employee/{$employee->id}/custom-fields", [
            'employee_id' => $employee->id,
            'field_key' => 'Invalid Field Key!',
            'field_type' => 'text',
        ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['field_key']);
});

test('custom field belongs to employee', function () {
    $employee = Employee::factory()->create();
    $customField = EmployeeCustomField::factory()->create([
        'employee_id' => $employee->id,
    ]);

    expect($customField->employee)->toBeInstanceOf(Employee::class);
    expect($customField->employee->id)->toBe($employee->id);
});

test('employee has many custom fields', function () {
    $employee = Employee::factory()->create();
    EmployeeCustomField::factory()->count(3)->create([
        'employee_id' => $employee->id,
    ]);

    expect($employee->customFields)->toHaveCount(3);
    expect($employee->customFields->first())->toBeInstanceOf(EmployeeCustomField::class);
});

test('enforces unique constraint on employee_id and field_key combination', function () {
    $employee = Employee::factory()->create();

    EmployeeCustomField::factory()->create([
        'employee_id' => $employee->id,
        'field_key' => 'unique-key',
    ]);

    $this->expectException(\Illuminate\Database\QueryException::class);

    EmployeeCustomField::factory()->create([
        'employee_id' => $employee->id,
        'field_key' => 'unique-key',
    ]);
});

test('requires authentication', function () {
    $employee = Employee::factory()->create();

    $response = $this->getJson("/dashboard/hr/employee/{$employee->id}/custom-fields");

    $response->assertUnauthorized();
});
