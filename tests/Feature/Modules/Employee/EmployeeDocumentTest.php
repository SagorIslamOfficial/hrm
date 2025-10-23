<?php

use App\Models\User;
use App\Modules\Department\Models\Department;
use App\Modules\Department\Models\Designation;
use App\Modules\Employee\Models\Employee;
use App\Modules\Employee\Models\EmployeeDocument;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('can list employee documents', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    EmployeeDocument::factory()->count(3)->create([
        'employee_id' => $employee->id,
    ]);

    $response = $this->actingAs($user)
        ->getJson("/dashboard/employees/{$employee->id}/documents");

    $response->assertSuccessful()
        ->assertJsonStructure([
            'documents' => [
                '*' => [
                    'id',
                    'doc_type',
                    'title',
                    'file_path',
                    'expiry_date',
                ],
            ],
        ]);
});

it('can create an employee document', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $documentData = [
        'doc_type' => 'contract',
        'title' => 'Employment Contract 2025',
        'expiry_date' => now()->addYear()->toDateString(),
    ];

    $response = $this->actingAs($user)
        ->postJson("/dashboard/employees/{$employee->id}/documents", $documentData);

    $response->assertCreated()
        ->assertJsonStructure([
            'success',
            'message',
            'document' => [
                'id',
                'doc_type',
                'title',
                'expiry_date',
            ],
        ]);

    expect(EmployeeDocument::where('title', 'Employment Contract 2025')->exists())->toBeTrue();
});

it('can update an employee document', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $document = EmployeeDocument::factory()->create([
        'employee_id' => $employee->id,
        'title' => 'Original Title',
    ]);

    $updateData = [
        'doc_type' => 'offer_letter',
        'title' => 'Updated Title',
        'expiry_date' => now()->addMonths(6)->toDateString(),
    ];

    $response = $this->actingAs($user)
        ->putJson("/dashboard/employees/{$employee->id}/documents/{$document->id}", $updateData);

    $response->assertSuccessful()
        ->assertJsonStructure([
            'success',
            'message',
            'document' => [
                'id',
                'doc_type',
                'title',
                'expiry_date',
            ],
        ]);

    expect($document->fresh()->title)->toBe('Updated Title');
});

it('can delete an employee document', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $document = EmployeeDocument::factory()->create([
        'employee_id' => $employee->id,
    ]);

    $response = $this->actingAs($user)
        ->deleteJson("/dashboard/employees/{$employee->id}/documents/{$document->id}");

    $response->assertSuccessful()
        ->assertJson([
            'success' => true,
            'message' => 'Document deleted successfully.',
        ]);

    expect(EmployeeDocument::find($document->id))->toBeNull();
});

it('validates required fields when creating document', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $response = $this->actingAs($user)
        ->postJson("/dashboard/employees/{$employee->id}/documents", []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['doc_type', 'title']);
});

it('prevents access to documents of other employees', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $otherEmployee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $document = EmployeeDocument::factory()->create([
        'employee_id' => $otherEmployee->id,
    ]);

    $response = $this->actingAs($user)
        ->getJson("/dashboard/employees/{$employee->id}/documents/{$document->id}");

    $response->assertNotFound();
});

it('tracks uploader when document is created', function () {
    $user = User::factory()->create(['name' => 'HR Admin']);
    $department = Department::factory()->create();
    $designation = Designation::factory()->create();

    $employee = Employee::factory()->create([
        'department_id' => $department->id,
        'designation_id' => $designation->id,
    ]);

    $documentData = [
        'doc_type' => 'contract',
        'title' => 'Test Document',
    ];

    $response = $this->actingAs($user)
        ->postJson("/dashboard/employees/{$employee->id}/documents", $documentData);

    $response->assertCreated();

    $document = EmployeeDocument::first();
    expect($document->uploaded_by)->toBe($user->id);
    expect($document->uploader->name)->toBe('HR Admin');
});
