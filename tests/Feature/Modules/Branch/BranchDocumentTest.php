<?php

use App\Models\User;
use App\Modules\HR\Organization\Branch\Models\Branch;
use App\Modules\HR\Organization\Branch\Models\BranchDocument;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    Storage::fake('public');
    Role::firstOrCreate(['name' => 'Admin']);
    Role::firstOrCreate(['name' => 'HR']);
    Role::firstOrCreate(['name' => 'Manager']);
});

it('can upload a document to a branch', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();
    $file = UploadedFile::fake()->create('test-document.pdf', 1024);

    $response = $this->actingAs($admin)
        ->post(route('branches.documents.store', $branch->id), [
            'doc_type' => 'license',
            'title' => 'Business License',
            'file' => $file,
            'expiry_date' => now()->addYear()->format('Y-m-d'),
        ]);

    $response->assertCreated()
        ->assertJson([
            'success' => true,
            'message' => 'Document uploaded successfully.',
        ]);

    $branch->refresh();
    expect($branch->documents)->toHaveCount(1);
    expect($branch->documents->first()->title)->toBe('Business License');
    expect($branch->documents->first()->doc_type)->toBe('license');
    expect($branch->documents->first()->uploaded_by)->toBe($admin->id);

    Storage::disk('public')->assertExists($branch->documents->first()->file_path);
});

it('validates required fields when uploading document', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();

    $this->actingAs($admin)
        ->post(route('branches.documents.store', $branch->id), [
            // Missing required fields
        ])
        ->assertSessionHasErrors(['doc_type', 'title', 'file']);
});

it('validates file types when uploading document', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();
    $file = UploadedFile::fake()->create('malicious.exe', 1024);

    $this->actingAs($admin)
        ->post(route('branches.documents.store', $branch->id), [
            'doc_type' => 'license',
            'title' => 'Test Document',
            'file' => $file,
        ])
        ->assertSessionHasErrors(['file']);
});

it('validates max file size (10MB)', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();
    $file = UploadedFile::fake()->create('large-file.pdf', 11000); // 11MB

    $this->actingAs($admin)
        ->post(route('branches.documents.store', $branch->id), [
            'doc_type' => 'license',
            'title' => 'Large Document',
            'file' => $file,
        ])
        ->assertSessionHasErrors(['file']);
});

it('accepts various allowed file types', function ($extension, $mimeType) {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();
    $file = UploadedFile::fake()->create("document.{$extension}", 1024, $mimeType);

    $this->actingAs($admin)
        ->post(route('branches.documents.store', $branch->id), [
            'doc_type' => 'contract',
            'title' => 'Test Document',
            'file' => $file,
        ])
        ->assertCreated();

    $branch->refresh();
    expect($branch->documents)->toHaveCount(1);
})->with([
    ['pdf', 'application/pdf'],
    ['doc', 'application/msword'],
    ['docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ['jpg', 'image/jpeg'],
    ['png', 'image/png'],
    ['xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    ['zip', 'application/zip'],
]);

it('can list all documents for a branch', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();

    // Create multiple documents
    BranchDocument::factory()->count(3)->create([
        'branch_id' => $branch->id,
        'uploaded_by' => $admin->id,
    ]);

    $response = $this->actingAs($admin)
        ->get(route('branches.documents.index', $branch->id));

    $response->assertOk()
        ->assertJsonCount(3, 'data');
});

it('can show a specific document', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();
    $document = BranchDocument::factory()->create([
        'branch_id' => $branch->id,
        'title' => 'Specific Document',
        'uploaded_by' => $admin->id,
    ]);

    $response = $this->actingAs($admin)
        ->get(route('branches.documents.show', [$branch, $document]));

    $response->assertOk()
        ->assertJson([
            'data' => [
                'id' => $document->id,
                'title' => 'Specific Document',
            ],
        ]);
});

it('can update document metadata without changing file', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();
    $document = BranchDocument::factory()->create([
        'branch_id' => $branch->id,
        'title' => 'Original Title',
        'doc_type' => 'license',
        'uploaded_by' => $admin->id,
    ]);

    $this->actingAs($admin)
        ->put(route('branches.documents.update', [$branch, $document]), [
            'title' => 'Updated Title',
            'doc_type' => 'contract',
        ])
        ->assertOk()
        ->assertJson([
            'success' => true,
            'message' => 'Document updated successfully.',
        ]);

    $document->refresh();
    expect($document->title)->toBe('Updated Title');
    expect($document->doc_type)->toBe('contract');
});

it('can update document and replace file', function () {
    Storage::fake('public');

    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();
    $oldFile = UploadedFile::fake()->create('old-doc.pdf', 512);

    // Create document with old file
    $response = $this->actingAs($admin)
        ->post(route('branches.documents.store', $branch->id), [
            'doc_type' => 'license',
            'title' => 'Test Document',
            'file' => $oldFile,
        ]);

    $document = BranchDocument::where('branch_id', $branch->id)->first();
    $oldPath = $document->file_path;

    // Update with new file
    $newFile = UploadedFile::fake()->create('new-doc.pdf', 512);

    $this->actingAs($admin)
        ->put(route('branches.documents.update', [$branch, $document]), [
            'title' => 'Updated Document',
            'doc_type' => 'license',
            'file' => $newFile,
        ])->assertOk();

    $document->refresh();

    // Old file should be deleted
    Storage::disk('public')->assertMissing($oldPath);
    // New file should exist
    Storage::disk('public')->assertExists($document->file_path);
});

it('can delete a document', function () {
    Storage::fake('public');

    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();
    $file = UploadedFile::fake()->create('to-delete.pdf', 512);

    $this->actingAs($admin)
        ->post(route('branches.documents.store', $branch->id), [
            'doc_type' => 'license',
            'title' => 'Document to Delete',
            'file' => $file,
        ]);

    $document = BranchDocument::where('branch_id', $branch->id)->first();
    $filePath = $document->file_path;

    $this->actingAs($admin)
        ->delete(route('branches.documents.destroy', [$branch, $document]))
        ->assertOk()
        ->assertJson([
            'success' => true,
            'message' => 'Document deleted successfully.',
        ]);

    expect(BranchDocument::find($document->id))->toBeNull();
    Storage::disk('public')->assertMissing($filePath);
});

it('can download a document', function () {
    Storage::fake('public');

    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();
    $file = UploadedFile::fake()->create('download-test.pdf', 512);

    $this->actingAs($admin)
        ->post(route('branches.documents.store', $branch->id), [
            'doc_type' => 'license',
            'title' => 'Document to Download',
            'file' => $file,
        ]);

    $document = BranchDocument::where('branch_id', $branch->id)->first();

    $response = $this->actingAs($admin)
        ->get(route('branches.documents.download', [$branch, $document]));

    $response->assertOk();
    $response->assertDownload();
});

it('tracks expiry dates and flags expired documents', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();

    // Expired document
    $expiredDoc = BranchDocument::factory()->create([
        'branch_id' => $branch->id,
        'title' => 'Expired License',
        'expiry_date' => now()->subDays(10),
        'uploaded_by' => $admin->id,
    ]);

    // Expiring soon document (< 30 days)
    $expiringSoonDoc = BranchDocument::factory()->create([
        'branch_id' => $branch->id,
        'title' => 'Expiring Soon License',
        'expiry_date' => now()->addDays(15),
        'uploaded_by' => $admin->id,
    ]);

    // Valid document
    $validDoc = BranchDocument::factory()->create([
        'branch_id' => $branch->id,
        'title' => 'Valid License',
        'expiry_date' => now()->addMonths(6),
        'uploaded_by' => $admin->id,
    ]);

    expect($expiredDoc->is_expired)->toBeTrue();
    expect($expiredDoc->is_expiring_soon)->toBeFalse();

    expect($expiringSoonDoc->is_expired)->toBeFalse();
    expect($expiringSoonDoc->is_expiring_soon)->toBeTrue();

    expect($validDoc->is_expired)->toBeFalse();
    expect($validDoc->is_expiring_soon)->toBeFalse();
});

it('stores uploader information with document', function () {
    $admin = User::factory()->create(['name' => 'Admin User']);
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();
    $file = UploadedFile::fake()->create('test.pdf', 512);

    $this->actingAs($admin)
        ->post(route('branches.documents.store', $branch->id), [
            'doc_type' => 'license',
            'title' => 'Test Document',
            'file' => $file,
        ]);

    $document = BranchDocument::where('branch_id', $branch->id)->first();
    $document->load('uploader');

    expect($document->uploaded_by)->toBe($admin->id);
    expect($document->uploader)->not->toBeNull();
    expect($document->uploader->name)->toBe('Admin User');
});

it('prevents Manager from uploading documents', function () {
    $manager = User::factory()->create();
    $manager->assignRole('Manager');

    $branch = Branch::factory()->create();
    $file = UploadedFile::fake()->create('test.pdf', 512);

    $this->actingAs($manager)
        ->post(route('branches.documents.store', $branch->id), [
            'doc_type' => 'license',
            'title' => 'Test Document',
            'file' => $file,
        ])
        ->assertForbidden();
});

it('allows HR admin to upload documents', function () {
    $hr = User::factory()->create();
    $hr->assignRole('HR');

    $branch = Branch::factory()->create();
    $file = UploadedFile::fake()->create('test.pdf', 512);

    $this->actingAs($hr)
        ->post(route('branches.documents.store', $branch->id), [
            'doc_type' => 'license',
            'title' => 'HR Uploaded Document',
            'file' => $file,
        ])
        ->assertCreated();

    $branch->refresh();
    expect($branch->documents)->toHaveCount(1);
});

it('validates expiry date must be in the future on create', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();
    $file = UploadedFile::fake()->create('test.pdf', 512);

    $this->actingAs($admin)
        ->post(route('branches.documents.store', $branch->id), [
            'doc_type' => 'license',
            'title' => 'Test Document',
            'file' => $file,
            'expiry_date' => now()->subDay()->format('Y-m-d'),
        ])
        ->assertSessionHasErrors(['expiry_date']);
});

it('generates file URLs correctly', function () {
    Storage::fake('public');

    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();
    $file = UploadedFile::fake()->create('test.pdf', 512);

    $this->actingAs($admin)
        ->post(route('branches.documents.store', $branch->id), [
            'doc_type' => 'license',
            'title' => 'Test Document',
            'file' => $file,
        ]);

    $document = BranchDocument::where('branch_id', $branch->id)->first();

    expect($document->file_url)->toContain('/storage/');
    expect($document->file_url)->toContain('/storage/branches/documents/');
    expect($document->file_url)->toContain('.pdf');
});

it('deletes file when branch document model is deleted', function () {
    Storage::fake('public');

    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $branch = Branch::factory()->create();
    $file = UploadedFile::fake()->create('test.pdf', 512);

    $this->actingAs($admin)
        ->post(route('branches.documents.store', $branch->id), [
            'doc_type' => 'license',
            'title' => 'Test Document',
            'file' => $file,
        ]);

    $document = BranchDocument::where('branch_id', $branch->id)->first();
    $filePath = $document->file_path;

    Storage::disk('public')->assertExists($filePath);

    $document->delete();

    Storage::disk('public')->assertMissing($filePath);
});
