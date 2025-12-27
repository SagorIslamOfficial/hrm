<?php

use App\Models\User;
use App\Modules\HR\Employee\Models\Employee;
use App\Modules\HR\Organization\Complaint\Models\Complaint;
use App\Modules\HR\Organization\Complaint\Services\ComplaintService;
use App\Modules\HR\Organization\Department\Models\Department;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Create complaint management permissions
    Permission::firstOrCreate(['name' => 'manage-complaint-categories']);
    Permission::firstOrCreate(['name' => 'manage-complaint-templates']);

    // Create roles and assign permissions
    $adminRole = Role::firstOrCreate(['name' => 'Admin']);
    $adminRole->givePermissionTo(Permission::all());

    Role::firstOrCreate(['name' => 'HR']);
    Role::firstOrCreate(['name' => 'Manager']);
    Role::firstOrCreate(['name' => 'Employee']);
});

// ============================================
// MODEL TESTS
// ============================================

describe('Complaint Model', function () {
    it('can create a complaint with factory', function () {
        $employee = Employee::factory()->create();

        $complaint = Complaint::create([
            'complaint_number' => 'CPL-2025-00001',
            'title' => 'Test Complaint',
            'categories' => ['harassment', 'workplace_safety'],
            'priority' => 'medium',
            'status' => 'draft',
            'employee_id' => $employee->id,
            'incident_date' => now()->subDays(5),
            'brief_description' => 'This is a test complaint',
        ]);

        expect($complaint)->toBeInstanceOf(Complaint::class);
        expect($complaint->complaint_number)->toBe('CPL-2025-00001');
        expect($complaint->status->value)->toBe('draft');
        expect($complaint->priority->value)->toBe('medium');
        expect($complaint->categories)->toBe(['harassment', 'workplace_safety']);
    });

    it('has correct status label accessor', function () {
        $employee = Employee::factory()->create();

        $complaint = Complaint::create([
            'complaint_number' => 'CPL-2025-00002',
            'title' => 'Test Complaint',
            'categories' => ['discrimination'],
            'priority' => 'high',
            'status' => 'under_review',
            'employee_id' => $employee->id,
            'incident_date' => now()->subDays(3),
            'brief_description' => 'Test description',
        ]);

        expect($complaint->status_label)->toBe('Under Review');
        expect($complaint->priority_label)->toBe('High');
    });

    it('can determine if complaint is overdue', function () {
        $employee = Employee::factory()->create();

        $overdueComplaint = Complaint::create([
            'complaint_number' => 'CPL-2025-00003',
            'title' => 'Overdue Complaint',
            'categories' => ['harassment'],
            'priority' => 'high',
            'status' => 'submitted',
            'employee_id' => $employee->id,
            'incident_date' => now()->subDays(5),
            'incident_date' => now()->subDays(10),
            'brief_description' => 'Test description',
            'due_date' => now()->subDays(1),
        ]);

        $activeComplaint = Complaint::create([
            'complaint_number' => 'CPL-2025-00004',
            'title' => 'Active Complaint',
            'categories' => ['workplace_safety'],
            'priority' => 'medium',
            'status' => 'submitted',
            'employee_id' => $employee->id,
            'incident_date' => now()->subDays(5),
            'incident_date' => now()->subDays(2),
            'brief_description' => 'Test description',
            'due_date' => now()->addDays(5),
        ]);

        expect($overdueComplaint->is_overdue)->toBeTrue();
        expect($activeComplaint->is_overdue)->toBeFalse();
    });

    it('has relationships with all related models', function () {
        $employee = Employee::factory()->create();
        $department = Department::factory()->create();
        $user = User::factory()->create();

        $complaint = Complaint::create([
            'complaint_number' => 'CPL-2025-00005',
            'title' => 'Complaint with Relations',
            'categories' => ['discrimination', 'retaliation'],
            'priority' => 'medium',
            'status' => 'draft',
            'employee_id' => $employee->id,
            'incident_date' => now()->subDays(5),
            'department_id' => $department->id,
            'assigned_to' => $user->id,
            'incident_date' => now()->subDays(7),
            'brief_description' => 'Test description',
        ]);

        expect($complaint->employee)->toBeInstanceOf(Employee::class);
        expect($complaint->department)->toBeInstanceOf(Department::class);
        expect($complaint->assignedTo)->toBeInstanceOf(User::class);
        expect($complaint->categories)->toBeArray();
        expect($complaint->categories)->toContain('discrimination');
    });

    it('can use scopes correctly', function () {
        $employee = Employee::factory()->create();

        // Create various complaints
        Complaint::create([
            'complaint_number' => 'CPL-2025-00010',
            'title' => 'Active Complaint',
            'categories' => ['harassment'],
            'priority' => 'high',
            'status' => 'submitted',
            'employee_id' => $employee->id,
            'incident_date' => now()->subDays(5),
            'incident_date' => now()->subDays(4),
            'brief_description' => 'Active test',
        ]);

        Complaint::create([
            'complaint_number' => 'CPL-2025-00011',
            'title' => 'Resolved Complaint',
            'categories' => ['policy_violation'],
            'priority' => 'low',
            'status' => 'resolved',
            'employee_id' => $employee->id,
            'incident_date' => now()->subDays(5),
            'incident_date' => now()->subDays(14),
            'brief_description' => 'Resolved test',
        ]);

        Complaint::create([
            'complaint_number' => 'CPL-2025-00012',
            'title' => 'Escalated Complaint',
            'categories' => ['discrimination'],
            'priority' => 'urgent',
            'status' => 'escalated',
            'employee_id' => $employee->id,
            'incident_date' => now()->subDays(5),
            'incident_date' => now()->subDays(6),
            'brief_description' => 'Escalated test',
            'is_escalated' => true,
        ]);

        expect(Complaint::active()->count())->toBe(2);
        expect(Complaint::byPriority('high')->count())->toBe(1);
        expect(Complaint::byStatus('resolved')->count())->toBe(1);
        expect(Complaint::escalated()->count())->toBe(1);
    });

    it('can store and retrieve categories as JSON array', function () {
        $employee = Employee::factory()->create();
        $categories = ['harassment', 'discrimination', 'retaliation'];

        $complaint = Complaint::create([
            'complaint_number' => 'CPL-2025-00013',
            'title' => 'Multi-category Complaint',
            'categories' => $categories,
            'priority' => 'high',
            'status' => 'draft',
            'employee_id' => $employee->id,
            'incident_date' => now()->subDays(5),
            'incident_date' => now()->subDays(8),
            'brief_description' => 'Test with multiple categories',
        ]);

        $complaint->refresh();

        expect($complaint->categories)->toBe($categories);
        expect(count($complaint->categories))->toBe(3);
    });
});

// ============================================
// SERVICE TESTS
// ============================================

describe('ComplaintService', function () {
    it('can create complaint with all data', function () {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');
        $this->actingAs($admin);

        $service = app(ComplaintService::class);
        $employee = Employee::factory()->create();

        $data = [
            'title' => 'Service Created Complaint',
            'categories' => ['harassment', 'workplace_safety'],
            'priority' => 'high',
            'status' => 'draft',
            'employee_id' => $employee->id,
            'incident_date' => now()->subDays(5),
            'brief_description' => 'Test brief description',
            'incident_date' => now()->subDays(3)->toDateString(),
            'incident_location' => 'Office Building A',
            'is_anonymous' => false,
            'is_confidential' => true,
            'is_recurring' => false,
        ];

        $complaint = $service->createComplaint($data);

        expect($complaint)->toBeInstanceOf(Complaint::class);
        expect($complaint->title)->toBe('Service Created Complaint');
        expect($complaint->categories)->toBe(['harassment', 'workplace_safety']);
        expect($complaint->statusHistory)->toHaveCount(1);
    });

    it('can update complaint', function () {
        $service = app(ComplaintService::class);
        $employee = Employee::factory()->create();

        $complaint = Complaint::create([
            'complaint_number' => 'CPL-2025-00020',
            'title' => 'Original Title',
            'categories' => ['harassment'],
            'priority' => 'low',
            'status' => 'draft',
            'employee_id' => $employee->id,
            'incident_date' => now()->subDays(5),
            'incident_date' => now()->subDays(9),
            'brief_description' => 'Original description',
        ]);

        $updated = $service->updateComplaint($complaint->id, [
            'title' => 'Updated Title',
            'priority' => 'high',
            'categories' => ['harassment', 'discrimination'],
        ]);

        expect($updated->title)->toBe('Updated Title');
        expect($updated->priority->value)->toBe('high');
        expect($updated->categories)->toBe(['harassment', 'discrimination']);
    });

    it('can submit complaint and set SLA', function () {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');
        $this->actingAs($admin);

        $service = app(ComplaintService::class);
        $employee = Employee::factory()->create();

        $complaint = Complaint::create([
            'complaint_number' => 'CPL-2025-00021',
            'title' => 'Draft Complaint',
            'categories' => ['workplace_safety'],
            'priority' => 'medium',
            'status' => 'draft',
            'employee_id' => $employee->id,
            'incident_date' => now()->subDays(5),
            'brief_description' => 'Test description',
            'sla_hours' => 48,
        ]);

        $submitted = $service->submitComplaint($complaint->id);

        expect($submitted->status->value)->toBe('submitted');
        expect($submitted->submitted_at)->not->toBeNull();
        expect($submitted->due_date)->not->toBeNull();
    });

    it('can update complaint status with history', function () {
        $service = app(ComplaintService::class);
        $employee = Employee::factory()->create();
        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        $this->actingAs($admin);

        $complaint = Complaint::create([
            'complaint_number' => 'CPL-2025-00022',
            'title' => 'Status Test',
            'categories' => ['policy_violation'],
            'priority' => 'medium',
            'status' => 'submitted',
            'employee_id' => $employee->id,
            'incident_date' => now()->subDays(5),
            'brief_description' => 'Test description',
        ]);

        $updated = $service->updateComplaintStatus($complaint->id, 'under_review', 'Starting investigation');

        expect($updated->status->value)->toBe('under_review');
        expect($updated->statusHistory)->toHaveCount(1);
        expect($updated->statusHistory->first()->to_status)->toBe('under_review');
    });

    it('can escalate complaint', function () {
        $service = app(ComplaintService::class);
        $employee = Employee::factory()->create();
        $hrUser = User::factory()->create();
        $hrUser->assignRole('HR');
        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        $this->actingAs($admin);

        $complaint = Complaint::create([
            'complaint_number' => 'CPL-2025-00023',
            'title' => 'Escalation Test',
            'categories' => ['harassment'],
            'priority' => 'high',
            'status' => 'under_review',
            'employee_id' => $employee->id,
            'incident_date' => now()->subDays(5),
            'assigned_to' => $hrUser->id,
            'brief_description' => 'Test description',
        ]);

        $escalated = $service->escalateComplaint($complaint->id, $admin->id, 'Requires senior management attention');

        expect($escalated->is_escalated)->toBeTrue();
        expect($escalated->escalated_to)->toBeArray();
        expect($escalated->escalated_to)->toContain($admin->id);
        expect($escalated->status->value)->toBe('escalated');
        expect($escalated->escalations)->toHaveCount(1);
    });
});

// ============================================
// CONTROLLER / HTTP TESTS
// ============================================

describe('Complaint Index', function () {
    it('shows complaints index for admin', function () {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        $this->actingAs($admin)
            ->get(route('complaints.index'))
            ->assertSuccessful()
            ->assertInertia(fn ($page) => $page
                ->component('modules/complaint/index')
                ->has('complaints')
            );
    });

    it('shows complaints index for employee', function () {
        $user = User::factory()->create();
        $user->assignRole('Employee');

        $this->actingAs($user)
            ->get(route('complaints.index'))
            ->assertSuccessful();
    });

    it('denies access to unauthenticated users', function () {
        $this->get(route('complaints.index'))
            ->assertRedirect(route('login'));
    });
});

describe('Complaint Create', function () {
    it('shows create form with predefined categories', function () {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        $this->actingAs($admin)
            ->get(route('complaints.create'))
            ->assertSuccessful()
            ->assertInertia(fn ($page) => $page
                ->component('modules/complaint/create')
                ->has('predefinedCategories')
            );
    });

    it('can store new complaint', function () {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        $adminEmployee = Employee::factory()->create();
        $admin->update(['employee_id' => $adminEmployee->id]);

        $complainant = Employee::factory()->create();
        $subject = Employee::factory()->create();
        $hrUser = User::factory()->create();
        $hrUser->assignRole('HR');

        $response = $this->actingAs($admin)
            ->post(route('complaints.store'), [
                'title' => 'New Complaint',
                'categories' => ['harassment', 'workplace_safety'],
                'priority' => 'medium',
                'brief_description' => 'This is a test complaint description',
                'employee_id' => $complainant->id,
                'subject_employee_id' => $subject->id,
                'subject_relationship' => 'Colleague',
                'incident_date' => now()->subDays(2)->format('Y-m-d'),
                'assigned_to' => $hrUser->id,
                'is_anonymous' => false,
                'is_confidential' => false,
            ]);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();

        expect(Complaint::where('title', 'New Complaint')->exists())->toBeTrue();
    });

    it('validates required fields on store', function () {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        $this->actingAs($admin)
            ->post(route('complaints.store'), [])
            ->assertSessionHasErrors(['title', 'categories', 'employee_id', 'incident_date', 'brief_description', 'assigned_to']);
    });
});

describe('Complaint Show', function () {
    it('shows complaint details', function () {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');
        $employee = Employee::factory()->create();

        $complaint = Complaint::factory()->draft()->create([
            'employee_id' => $employee->id,
            'incident_date' => now()->subDays(5),
        ]);

        $this->actingAs($admin)
            ->get(route('complaints.show', $complaint->id))
            ->assertSuccessful()
            ->assertInertia(fn ($page) => $page
                ->component('modules/complaint/show')
                ->where('complaint.id', $complaint->id)
            );
    });

    it('denies access to unauthorized users', function () {
        $user = User::factory()->create();
        $user->assignRole('Employee');
        $employee = Employee::factory()->create();
        $otherEmployee = Employee::factory()->create();

        $complaint = Complaint::factory()->draft()->create([
            'employee_id' => $employee->id,
            'is_confidential' => true,
        ]);

        $this->actingAs($user)
            ->get(route('complaints.show', $complaint->id))
            ->assertForbidden();
    });
});

describe('Complaint Edit', function () {
    it('shows edit form for draft complaint', function () {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');
        $employee = Employee::factory()->create();

        $complaint = Complaint::factory()->draft()->create([
            'employee_id' => $employee->id,
            'incident_date' => now()->subDays(5),
        ]);

        $this->actingAs($admin)
            ->get(route('complaints.edit', $complaint->id))
            ->assertSuccessful()
            ->assertInertia(fn ($page) => $page
                ->component('modules/complaint/edit')
                ->where('complaint.id', $complaint->id)
            );
    });

    it('denies edit for non-draft complaint', function () {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');
        $employee = Employee::factory()->create();

        $complaint = Complaint::factory()->submitted()->create([
            'employee_id' => $employee->id,
            'incident_date' => now()->subDays(5),
        ]);

        $this->actingAs($admin)
            ->get(route('complaints.edit', $complaint->id))
            ->assertForbidden();
    });

    it('can update draft complaint', function () {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');
        $employee = Employee::factory()->create();

        $complaint = Complaint::factory()->draft()->create([
            'title' => 'Original Title',
            'priority' => 'low',
            'categories' => ['harassment'],
            'employee_id' => $employee->id,
            'incident_date' => now()->subDays(5),
            'brief_description' => 'Original description',
        ]);

        $this->actingAs($admin)
            ->put(route('complaints.update', $complaint->id), [
                'title' => 'Updated Title',
                'priority' => 'high',
                'categories' => ['harassment', 'retaliation'],
                'brief_description' => 'Updated description',
            ])
            ->assertRedirect();

        $complaint->refresh();
        expect($complaint->title)->toBe('Updated Title');
        expect($complaint->priority->value)->toBe('high');
        expect($complaint->categories)->toBe(['harassment', 'retaliation']);
    });
});

describe('Complaint Submit', function () {
    it('can submit draft complaint', function () {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');
        $employee = Employee::factory()->create();

        $complaint = Complaint::factory()->draft()->create([
            'employee_id' => $employee->id,
            'incident_date' => now()->subDays(5),
        ]);

        $this->actingAs($admin)
            ->post(route('complaints.submit', $complaint->id))
            ->assertRedirect();

        $complaint->refresh();
        expect($complaint->status->value)->toBe('submitted');
        expect($complaint->submitted_at)->not->toBeNull();
    });
});

describe('Complaint Status Update', function () {
    it('can update status as admin', function () {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');
        $employee = Employee::factory()->create();

        $complaint = Complaint::factory()->submitted()->create([
            'employee_id' => $employee->id,
            'incident_date' => now()->subDays(5),
        ]);

        $this->actingAs($admin)
            ->post(route('complaints.updateStatus', $complaint->id), [
                'status' => 'under_review',
                'notes' => 'Starting review process',
            ])
            ->assertRedirect();

        $complaint->refresh();
        expect($complaint->status->value)->toBe('under_review');
    });

    it('validates status value', function () {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');
        $employee = Employee::factory()->create();

        $complaint = Complaint::factory()->submitted()->create([
            'employee_id' => $employee->id,
            'incident_date' => now()->subDays(5),
        ]);

        $this->actingAs($admin)
            ->post(route('complaints.updateStatus', $complaint->id), [
                'status' => 'invalid_status',
            ])
            ->assertSessionHasErrors(['status']);
    });
});

describe('Complaint Escalation', function () {
    it('can escalate complaint', function () {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');
        $hrUser = User::factory()->create();
        $hrUser->assignRole('HR');
        $employee = Employee::factory()->create();

        $complaint = Complaint::factory()->underReview()->highPriority()->create([
            'employee_id' => $employee->id,
            'incident_date' => now()->subDays(5),
            'assigned_to' => $hrUser->id,
        ]);

        $this->actingAs($admin)
            ->post(route('complaints.escalations.store', $complaint->id), [
                'escalated_to' => [$admin->id],
                'reason' => 'Requires senior management review',
            ])
            ->assertRedirect();

        $complaint->refresh();
        expect($complaint->is_escalated)->toBeTrue();
        expect($complaint->status->value)->toBe('escalated');
    });
});

describe('Complaint Comments', function () {
    it('can add comment to complaint', function () {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');
        $employee = Employee::factory()->create();

        $complaint = Complaint::create([
            'complaint_number' => 'CPL-2025-00050',
            'title' => 'Comment Test',
            'categories' => ['policy_violation'],
            'priority' => 'medium',
            'status' => 'submitted',
            'employee_id' => $employee->id,
            'incident_date' => now()->subDays(5),
            'brief_description' => 'Test description',
        ]);

        $this->actingAs($admin)
            ->post(route('complaints.comments.store', $complaint->id), [
                'comment' => 'This is a test comment',
                'comment_type' => 'internal',
                'is_private' => false,
            ])
            ->assertRedirect();

        expect($complaint->comments()->count())->toBe(1);
        expect($complaint->comments->first()->comment)->toBe('This is a test comment');
    });
});

describe('Complaint Documents', function () {
    it('can upload document to complaint', function () {
        Storage::fake('private');

        $admin = User::factory()->create();
        $admin->assignRole('Admin');
        $employee = Employee::factory()->create();

        $complaint = Complaint::create([
            'complaint_number' => 'CPL-2025-00051',
            'title' => 'Document Test',
            'categories' => ['harassment'],
            'priority' => 'medium',
            'status' => 'draft',
            'employee_id' => $employee->id,
            'incident_date' => now()->subDays(5),
            'brief_description' => 'Test description',
        ]);

        $file = UploadedFile::fake()->create('evidence.pdf', 1024);

        $this->actingAs($admin)
            ->post(route('complaints.documents.store', $complaint->id), [
                'document' => $file,
                'document_type' => 'evidence',
            ])
            ->assertRedirect();

        expect($complaint->documents()->count())->toBe(1);
    });
});

describe('Complaint Delete', function () {
    it('can soft delete draft complaint', function () {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');
        $employee = Employee::factory()->create();

        $complaint = Complaint::create([
            'complaint_number' => 'CPL-2025-00052',
            'title' => 'Delete Test',
            'categories' => ['workplace_safety'],
            'priority' => 'low',
            'status' => 'draft',
            'employee_id' => $employee->id,
            'incident_date' => now()->subDays(5),
            'brief_description' => 'Test description',
        ]);

        $this->actingAs($admin)
            ->delete(route('complaints.destroy', $complaint->id))
            ->assertRedirect(route('complaints.index'));

        expect(Complaint::find($complaint->id))->toBeNull();
        expect(Complaint::withTrashed()->find($complaint->id))->not->toBeNull();
    });

    it('cannot delete non-draft complaint', function () {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');
        $employee = Employee::factory()->create();

        $complaint = Complaint::create([
            'complaint_number' => 'CPL-2025-00053',
            'title' => 'Cannot Delete',
            'categories' => ['discrimination'],
            'priority' => 'medium',
            'status' => 'submitted',
            'employee_id' => $employee->id,
            'incident_date' => now()->subDays(5),
            'brief_description' => 'Test description',
        ]);

        $this->actingAs($admin)
            ->delete(route('complaints.destroy', $complaint->id))
            ->assertForbidden();
    });

    it('can restore soft deleted complaint', function () {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');
        $employee = Employee::factory()->create();

        $complaint = Complaint::create([
            'complaint_number' => 'CPL-2025-00054',
            'title' => 'Restore Test',
            'categories' => ['retaliation'],
            'priority' => 'low',
            'status' => 'draft',
            'employee_id' => $employee->id,
            'incident_date' => now()->subDays(5),
            'brief_description' => 'Test description',
        ]);

        $complaint->delete();

        $this->actingAs($admin)
            ->post(route('complaints.restore', $complaint->id))
            ->assertRedirect();

        expect(Complaint::find($complaint->id))->not->toBeNull();
    });

    it('can force delete complaint as admin', function () {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');
        $employee = Employee::factory()->create();

        $complaint = Complaint::create([
            'complaint_number' => 'CPL-2025-00055',
            'title' => 'Force Delete Test',
            'categories' => ['harassment'],
            'priority' => 'low',
            'status' => 'draft',
            'employee_id' => $employee->id,
            'incident_date' => now()->subDays(5),
            'brief_description' => 'Test description',
        ]);

        $complaint->delete();
        $complaintId = $complaint->id;

        $this->actingAs($admin)
            ->delete(route('complaints.forceDelete', $complaintId))
            ->assertRedirect(route('complaints.index'));

        expect(Complaint::withTrashed()->find($complaintId))->toBeNull();
    });
});

// ============================================
// AUTHORIZATION TESTS
// ============================================

describe('Complaint Authorization', function () {
    it('allows employee to create complaint', function () {
        $user = User::factory()->create();
        $user->assignRole('Employee');

        $this->actingAs($user)
            ->get(route('complaints.create'))
            ->assertSuccessful();
    });

    it('allows complainant to view own complaint', function () {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');
        $employee = Employee::factory()->create();

        $complaint = Complaint::create([
            'complaint_number' => 'CPL-2025-00060',
            'title' => 'My Complaint',
            'categories' => ['harassment'],
            'priority' => 'medium',
            'status' => 'submitted',
            'employee_id' => $employee->id,
            'incident_date' => now()->subDays(5),
            'brief_description' => 'Test description',
        ]);

        $this->actingAs($admin)
            ->get(route('complaints.show', $complaint->id))
            ->assertSuccessful();
    });

    it('denies HR role from force deleting', function () {
        $hr = User::factory()->create();
        $hr->assignRole('HR');
        $employee = Employee::factory()->create();

        $complaint = Complaint::create([
            'complaint_number' => 'CPL-2025-00061',
            'title' => 'HR Cannot Force Delete',
            'categories' => ['policy_violation'],
            'priority' => 'low',
            'status' => 'draft',
            'employee_id' => $employee->id,
            'incident_date' => now()->subDays(5),
            'brief_description' => 'Test description',
        ]);

        $complaint->delete();

        $this->actingAs($hr)
            ->delete(route('complaints.forceDelete', $complaint->id))
            ->assertForbidden();
    });
});
