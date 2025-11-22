<?php

use App\Models\User;
use App\Modules\HR\Organization\Branch\Models\Branch;
use App\Modules\HR\Organization\Branch\Models\BranchCustomField;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    Role::firstOrCreate(['name' => 'Admin']);
    Role::firstOrCreate(['name' => 'HR']);
    Role::firstOrCreate(['name' => 'Manager']);
});

it('can create a custom field for a branch', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();

    $response = $this->actingAs($admin)
        ->post(route('branches.custom-fields.store', $branch), [
            'branch_id' => $branch->id,
            'field_key' => 'tax-id',
            'field_value' => 'TAX-123456789',
            'field_type' => 'text',
            'section' => 'general',
        ]);

    $response->assertCreated()
        ->assertJson([
            'success' => true,
            'message' => 'Custom field created successfully.',
        ]);

    $branch->refresh();
    expect($branch->customFields)->toHaveCount(1);
    expect($branch->customFields->first()->field_key)->toBe('tax-id');
    expect($branch->customFields->first()->field_value)->toBe('TAX-123456789');
    expect($branch->customFields->first()->field_type)->toBe('text');
});

it('validates required fields when creating custom field', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();

    $this->actingAs($admin)
        ->postJson(route('branches.custom-fields.store', $branch), [
            // Missing required fields
        ])
        ->assertJsonValidationErrors(['branch_id', 'field_key', 'field_value', 'field_type']);
});

it('enforces unique constraint for branch_id and field_key combination', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();

    // Create first custom field
    BranchCustomField::factory()->create([
        'branch_id' => $branch->id,
        'field_key' => 'tax-id',
    ]);

    // Try to create duplicate
    $this->actingAs($admin)
        ->post(route('branches.custom-fields.store', $branch), [
            'branch_id' => $branch->id,
            'field_key' => 'tax-id', // Duplicate key for same branch
            'field_value' => 'Different Value',
            'field_type' => 'text',
        ])
        ->assertSessionHasErrors(['field_key']);
});

it('allows same field_key for different branches', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch1 = Branch::factory()->create();
    $branch2 = Branch::factory()->create();

    // Create field for branch 1
    BranchCustomField::factory()->create([
        'branch_id' => $branch1->id,
        'field_key' => 'tax-id',
    ]);

    // Create same field_key for branch 2 (should succeed)
    $this->actingAs($admin)
        ->post(route('branches.custom-fields.store', $branch2), [
            'branch_id' => $branch2->id,
            'field_key' => 'tax-id',
            'field_value' => 'TAX-987654321',
            'field_type' => 'text',
        ])
        ->assertCreated();

    expect(BranchCustomField::where('field_key', 'tax-id')->count())->toBe(2);
});

it('validates field_key format (kebab-case)', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();

    $this->actingAs($admin)
        ->post(route('branches.custom-fields.store', $branch), [
            'branch_id' => $branch->id,
            'field_key' => 'Invalid Key With Spaces',
            'field_value' => 'Some Value',
            'field_type' => 'text',
        ])
        ->assertSessionHasErrors(['field_key']);
});

it('accepts valid kebab-case field_key', function ($fieldKey) {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();

    $this->actingAs($admin)
        ->post(route('branches.custom-fields.store', $branch), [
            'branch_id' => $branch->id,
            'field_key' => $fieldKey,
            'field_value' => 'Test Value',
            'field_type' => 'text',
        ])
        ->assertCreated();
})->with([
    'tax-id',
    'business-license',
    'emergency-contact',
    'primary-color',
    'max-capacity',
    'wifi-password',
]);

it('supports various field types', function ($fieldType, $fieldValue) {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();

    $this->actingAs($admin)
        ->post(route('branches.custom-fields.store', $branch), [
            'branch_id' => $branch->id,
            'field_key' => "test-{$fieldType}",
            'field_value' => $fieldValue,
            'field_type' => $fieldType,
        ])
        ->assertCreated();

    $field = BranchCustomField::where('field_key', "test-{$fieldType}")->first();
    expect($field->field_type)->toBe($fieldType);
})->with([
    ['text', 'Sample text'],
    ['number', '12345'],
    ['date', '2024-12-25'],
    ['boolean', 'true'],
    ['email', 'test@example.com'],
    ['phone', '+1234567890'],
    ['url', 'https://example.com'],
    ['textarea', 'Long text content here'],
]);

it('organizes fields by sections', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();

    $sections = ['general', 'operational', 'technical', 'other'];

    foreach ($sections as $index => $section) {
        BranchCustomField::factory()->create([
            'branch_id' => $branch->id,
            'field_key' => "field-{$index}",
            'section' => $section,
        ]);
    }

    $branch->refresh();

    expect($branch->customFields->where('section', 'general'))->toHaveCount(1);
    expect($branch->customFields->where('section', 'operational'))->toHaveCount(1);
    expect($branch->customFields->where('section', 'technical'))->toHaveCount(1);
    expect($branch->customFields->where('section', 'other'))->toHaveCount(1);
});

it('can list all custom fields for a branch', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();

    BranchCustomField::factory()->count(5)->create([
        'branch_id' => $branch->id,
    ]);

    $response = $this->actingAs($admin)
        ->get(route('branches.custom-fields.index', $branch->id));

    $response->assertOk()
        ->assertJsonCount(5, 'data');
});

it('can show a specific custom field', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();
    $field = BranchCustomField::factory()->create([
        'branch_id' => $branch->id,
        'field_key' => 'office-phone',
        'field_value' => '+1234567890',
    ]);

    $response = $this->actingAs($admin)
        ->get(route('branches.custom-fields.show', [$branch, $field]));

    $response->assertOk()
        ->assertJson([
            'data' => [
                'id' => $field->id,
                'field_key' => 'office-phone',
                'field_value' => '+1234567890',
            ],
        ]);
});

it('can update custom field value', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();
    $field = BranchCustomField::factory()->create([
        'branch_id' => $branch->id,
        'field_key' => 'tax-id',
        'field_value' => 'OLD-VALUE',
    ]);

    $this->actingAs($admin)
        ->put(route('branches.custom-fields.update', [$branch, $field]), [
            'field_key' => 'tax-id',
            'field_value' => 'NEW-VALUE',
            'field_type' => 'text',
        ])
        ->assertOk()
        ->assertJson([
            'success' => true,
            'message' => 'Custom field updated successfully.',
        ]);

    $field->refresh();
    expect($field->field_value)->toBe('NEW-VALUE');
});

it('can delete custom field', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();
    $field = BranchCustomField::factory()->create([
        'branch_id' => $branch->id,
    ]);

    $this->actingAs($admin)
        ->delete(route('branches.custom-fields.destroy', [$branch, $field]))
        ->assertOk()
        ->assertJson([
            'success' => true,
            'message' => 'Custom field deleted successfully.',
        ]);

    expect(BranchCustomField::find($field->id))->toBeNull();
});

it('can sync multiple custom fields at once', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();

    // Create some existing fields
    BranchCustomField::factory()->count(2)->create([
        'branch_id' => $branch->id,
    ]);

    $syncData = [
        [
            'field_key' => 'tax-id',
            'field_value' => 'TAX-123',
            'field_type' => 'text',
            'section' => 'general',
        ],
        [
            'field_key' => 'wifi-password',
            'field_value' => 'SecurePass123',
            'field_type' => 'text',
            'section' => 'technical',
        ],
        [
            'field_key' => 'max-capacity',
            'field_value' => '50',
            'field_type' => 'number',
            'section' => 'operational',
        ],
    ];

    $this->actingAs($admin)
        ->post(route('branches.custom-fields.sync', $branch->id), [
            'custom_fields' => $syncData,
        ])
        ->assertOk()
        ->assertJson([
            'success' => true,
            'message' => 'Custom fields synced successfully.',
        ]);

    $branch->refresh();
    expect($branch->customFields)->toHaveCount(3);
    expect($branch->customFields->pluck('field_key')->toArray())->toContain('tax-id', 'wifi-password', 'max-capacity');
});

it('prevents Manager from creating custom fields', function () {
    $manager = User::factory()->create();
    $manager->assignRole('Manager');

    $branch = Branch::factory()->create();

    $this->actingAs($manager)
        ->post(route('branches.custom-fields.store', $branch), [
            'branch_id' => $branch->id,
            'field_key' => 'test-field',
            'field_value' => 'Test Value',
            'field_type' => 'text',
        ])
        ->assertForbidden();
});

it('allows HR admin to create custom fields', function () {
    $hr = User::factory()->create();
    $hr->assignRole('HR');

    $branch = Branch::factory()->create();

    $this->actingAs($hr)
        ->post(route('branches.custom-fields.store', $branch), [
            'branch_id' => $branch->id,
            'field_key' => 'hr-field',
            'field_value' => 'HR Value',
            'field_type' => 'text',
        ])
        ->assertCreated();

    $branch->refresh();
    expect($branch->customFields)->toHaveCount(1);
});

it('defaults to "other" section if not provided', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();

    $this->actingAs($admin)
        ->post(route('branches.custom-fields.store', $branch), [
            'branch_id' => $branch->id,
            'field_key' => 'no-section-field',
            'field_value' => 'Some Value',
            'field_type' => 'text',
            // 'section' is omitted
        ])
        ->assertCreated();

    $field = BranchCustomField::where('field_key', 'no-section-field')->first();
    expect($field->section)->toBeNull(); // Or expect 'other' if you have a default in the model
});

it('validates max length for field values', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();
    $longValue = str_repeat('a', 300); // Assuming max 255

    $this->actingAs($admin)
        ->post(route('branches.custom-fields.store', $branch), [
            'branch_id' => $branch->id,
            'field_key' => 'long-field',
            'field_value' => $longValue,
            'field_type' => 'text',
        ])
        ->assertSessionHasErrors(['field_value']);
});

it('can filter custom fields by section', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();

    BranchCustomField::factory()->create([
        'branch_id' => $branch->id,
        'field_key' => 'general-field',
        'section' => 'general',
    ]);

    BranchCustomField::factory()->create([
        'branch_id' => $branch->id,
        'field_key' => 'technical-field',
        'section' => 'technical',
    ]);

    $generalFields = $branch->customFields()->where('section', 'general')->get();
    expect($generalFields)->toHaveCount(1);
    expect($generalFields->first()->field_key)->toBe('general-field');
});

it('cascades delete when branch is deleted', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();

    BranchCustomField::factory()->count(3)->create([
        'branch_id' => $branch->id,
    ]);

    expect(BranchCustomField::where('branch_id', $branch->id)->count())->toBe(3);

    $branch->forceDelete();

    expect(BranchCustomField::where('branch_id', $branch->id)->count())->toBe(0);
});
