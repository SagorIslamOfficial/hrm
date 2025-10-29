<?php

use App\Models\User;
use App\Modules\Employee\Models\Employee;
use App\Modules\Employee\Models\EmployeeContact;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('can list employee contacts', function () {
    $user = User::factory()->create();
    $employee = Employee::factory()->create();
    $contact = EmployeeContact::factory()->create([
        'employee_id' => $employee->id,
    ]);

    $response = $this->actingAs($user)
        ->getJson("/dashboard/employees/{$employee->id}/contacts");

    $response->assertSuccessful()
        ->assertJsonStructure([
            'contacts' => [
                '*' => [
                    'id',
                    'contact_name',
                    'relationship',
                    'phone',
                    'email',
                    'address',
                    'is_primary',
                ],
            ],
        ]);
});

it('can create an employee contact', function () {
    $user = User::factory()->create();
    $employee = Employee::factory()->create();

    $contactData = [
        'contact_name' => 'John Doe',
        'relationship' => 'spouse',
        'phone' => '+1234567890',
        'email' => 'john@example.com',
        'address' => '123 Main St',
        'is_primary' => true,
    ];

    $response = $this->actingAs($user)
        ->postJson("/dashboard/employees/{$employee->id}/contacts", $contactData);

    $response->assertCreated()
        ->assertJsonStructure([
            'success',
            'message',
            'contact' => [
                'id',
                'contact_name',
                'relationship',
                'phone',
                'email',
                'address',
                'is_primary',
            ],
        ]);

    expect(EmployeeContact::where('contact_name', 'John Doe')->exists())->toBeTrue();
});

it('can update an employee contact', function () {
    $user = User::factory()->create();
    $employee = Employee::factory()->create();
    $contact = EmployeeContact::factory()->create([
        'employee_id' => $employee->id,
        'contact_name' => 'Original Name',
    ]);

    $updateData = [
        'contact_name' => 'Updated Name',
        'relationship' => 'parent',
        'phone' => '+0987654321',
        'email' => 'updated@example.com',
        'address' => '456 Updated St',
        'is_primary' => false,
    ];

    $response = $this->actingAs($user)
        ->putJson("/dashboard/employees/{$employee->id}/contacts/{$contact->id}", $updateData);

    $response->assertSuccessful()
        ->assertJsonStructure([
            'success',
            'message',
            'contact' => [
                'id',
                'contact_name',
                'relationship',
                'phone',
                'email',
                'address',
                'is_primary',
            ],
        ]);

    expect($contact->fresh()->contact_name)->toBe('Updated Name');
});

it('can delete an employee contact', function () {
    $user = User::factory()->create();
    $employee = Employee::factory()->create();
    $contact = EmployeeContact::factory()->create([
        'employee_id' => $employee->id,
    ]);

    $response = $this->actingAs($user)
        ->deleteJson("/dashboard/employees/{$employee->id}/contacts/{$contact->id}");

    $response->assertSuccessful()
        ->assertJson([
            'success' => true,
            'message' => 'Emergency contact deleted successfully.',
        ]);

    expect(EmployeeContact::find($contact->id))->toBeNull();
});

it('validates required fields when creating contact', function () {
    $user = User::factory()->create();
    $employee = Employee::factory()->create();

    $response = $this->actingAs($user)
        ->postJson("/dashboard/employees/{$employee->id}/contacts", []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['contact_name', 'relationship', 'phone']);
});

it('prevents access to contacts of other employees', function () {
    $user = User::factory()->create();
    $employee = Employee::factory()->create();
    $otherEmployee = Employee::factory()->create();
    $contact = EmployeeContact::factory()->create([
        'employee_id' => $otherEmployee->id,
    ]);

    $response = $this->actingAs($user)
        ->getJson("/dashboard/employees/{$employee->id}/contacts/{$contact->id}");

    $response->assertNotFound();
});

it('sets only one primary contact per employee', function () {
    $user = User::factory()->create();
    $employee = Employee::factory()->create();

    // Create existing primary contact
    $existingContact = EmployeeContact::factory()->create([
        'employee_id' => $employee->id,
        'is_primary' => true,
    ]);

    // Create new primary contact
    $contactData = [
        'contact_name' => 'New Primary',
        'relationship' => 'parent',
        'phone' => '+1234567890',
        'is_primary' => true,
    ];

    $response = $this->actingAs($user)
        ->postJson("/dashboard/employees/{$employee->id}/contacts", $contactData);

    $response->assertCreated();

    // Check that the old primary contact is no longer primary
    expect($existingContact->fresh()->is_primary)->toBeFalse();

    // Check that the new contact is primary
    $newContact = EmployeeContact::where('contact_name', 'New Primary')->first();
    expect($newContact->is_primary)->toBeTrue();
});
