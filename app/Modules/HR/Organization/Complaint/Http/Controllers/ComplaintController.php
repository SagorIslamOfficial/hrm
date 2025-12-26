<?php

namespace App\Modules\HR\Organization\Complaint\Http\Controllers;

use App\Models\User;
use App\Modules\HR\Employee\Models\Employee;
use App\Modules\HR\Organization\Branch\Models\Branch;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintServiceInterface;
use App\Modules\HR\Organization\Complaint\Enums\ComplaintPriority;
use App\Modules\HR\Organization\Complaint\Enums\ComplaintSubjectType;
use App\Modules\HR\Organization\Complaint\Http\Requests\StoreComplaintRequest;
use App\Modules\HR\Organization\Complaint\Http\Requests\UpdateComplaintRequest;
use App\Modules\HR\Organization\Complaint\Models\Complaint;
use App\Modules\HR\Organization\Department\Models\Department;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ComplaintController
{
    use AuthorizesRequests;

    public function __construct(
        private ComplaintServiceInterface $complaintService
    ) {}

    // Display a listing of the resource.
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Complaint::class);

        $perPage = $request->input('per_page', 10);
        $complaints = $this->complaintService->getComplaintsPaginated($perPage);

        return Inertia::render('modules/complaint/index', compact('complaints'));
    }

    // Show the form for creating a new resource.
    public function create(): Response
    {
        $this->authorize('create', Complaint::class);

        $predefinedCategories = [
            'harassment',
            'discrimination',
            'workplace_safety',
            'policy_violation',
            'misconduct',
            'ethics',
            'bullying',
            'retaliation',
            'unfair_treatment',
            'other',
        ];

        $subjectTypes = ComplaintSubjectType::options();

        $priorities = collect(ComplaintPriority::cases())->map(fn ($priority) => [
            'value' => $priority->value,
            'label' => $priority->label(),
            'badgeClass' => $priority->badgeClass(),
        ])->values()->all();

        $assignees = User::whereHas('roles', function ($query) {
            $query->whereIn('name', ['Admin', 'HR', 'Manager']);
        })->with('roles')->select('id', 'name')->orderBy('name')->get()->map(function ($user) {
            $role = $user->roles->whereIn('name', ['Admin', 'HR', 'Manager'])->first();

            return [
                'value' => $user->id,
                'label' => $role ? $role->name : $user->name,
            ];
        })->toArray();

        return Inertia::render('modules/complaint/create', compact('predefinedCategories', 'priorities', 'assignees', 'subjectTypes'));
    }

    // Store a newly created resource in storage.
    public function store(StoreComplaintRequest $request)
    {
        $this->authorize('create', Complaint::class);

        $complaint = $this->complaintService->createComplaint($request->validated());

        return redirect()
            ->route('complaints.edit', $complaint)
            ->with('success', 'Complaint created successfully. Complete the details below.');
    }

    // Display the specified resource.
    public function show(Complaint $complaint): Response
    {
        $this->authorize('view', $complaint);

        $complaint->load([
            'employee',
            'department',
            'assignedTo',
            'subjects.subject',
            'statusHistory.changedBy',
            'comments.creator',
            'documents.uploader',
            'escalations.escalatedBy',
            'reminders',
        ]);

        $complaint->append('escalated_to_users');
        $complaint->escalations->each(function ($escalation) {
            $escalation->append('escalated_to_users');
        });

        $employees = Employee::with('user:id,name,employee_id')
            ->select('id', 'first_name', 'last_name', 'employee_code', 'email', 'phone', 'photo')
            ->orderBy('first_name')
            ->get()
            ->map(function ($employee) {
                $employee->user_id = $employee->user?->id;
                $employee->user_name = $employee->user?->name;

                return $employee;
            });

        return Inertia::render('modules/complaint/show', compact('complaint', 'employees'));
    }

    // Show the form for editing the specified resource.
    public function edit(Complaint $complaint): Response
    {
        $this->authorize('update', $complaint);

        $complaint->load(['subjects.subject', 'comments.creator', 'documents.uploader']);
        $employees = Employee::with('user:id,name,employee_id')
            ->select('id', 'first_name', 'last_name', 'employee_code', 'email', 'phone', 'photo')
            ->orderBy('first_name')
            ->get()
            ->map(function ($employee) {
                $employee->user_id = $employee->user?->id;
                $employee->user_name = $employee->user?->name;

                return $employee;
            });

        $predefinedCategories = [
            'harassment',
            'discrimination',
            'workplace_safety',
            'policy_violation',
            'misconduct',
            'ethics',
            'bullying',
            'retaliation',
            'unfair_treatment',
            'other',
        ];

        $subjectTypes = ComplaintSubjectType::options();

        $priorities = collect(ComplaintPriority::cases())->map(fn ($priority) => [
            'value' => $priority->value,
            'label' => $priority->label(),
            'badgeClass' => $priority->badgeClass(),
        ])->values()->all();

        $assignees = User::whereHas('roles', function ($query) {
            $query->whereIn('name', ['Admin', 'HR', 'Manager']);
        })->with('roles')->select('id', 'name')->orderBy('name')->get()->map(function ($user) {
            $role = $user->roles->whereIn('name', ['Admin', 'HR', 'Manager'])->first();

            return [
                'value' => $user->id,
                'label' => $role ? $role->name : $user->name,
            ];
        })->toArray();

        $departments = Department::select('id', 'name', 'code')->orderBy('name')->get();
        $branches = Branch::select('id', 'name', 'code')->orderBy('name')->get();

        return Inertia::render('modules/complaint/edit', compact('complaint', 'employees', 'departments', 'branches', 'predefinedCategories', 'priorities', 'assignees', 'subjectTypes'));
    }

    // Update the specified resource in storage.
    public function update(UpdateComplaintRequest $request, Complaint $complaint): RedirectResponse
    {
        $this->authorize('update', $complaint);

        $complaint = $this->complaintService->updateComplaint($complaint->id, $request->validated());

        return redirect()
            ->route('complaints.show', $complaint)
            ->with('success', 'Complaint updated successfully.');
    }

    // Remove the specified resource from storage.
    public function destroy(Complaint $complaint): RedirectResponse
    {
        $this->authorize('delete', $complaint);

        $this->complaintService->deleteComplaint($complaint->id);

        return redirect()
            ->route('complaints.index')
            ->with('success', 'Complaint deleted successfully.');
    }

    // Restore the specified resource from trash.
    public function restore(string $complaint): RedirectResponse
    {
        $complaintModel = Complaint::withTrashed()->findOrFail($complaint);
        $this->authorize('restore', $complaintModel);

        $this->complaintService->restoreComplaint($complaint);

        return redirect()
            ->route('complaints.show', $complaint)
            ->with('success', 'Complaint restored successfully.');
    }

    // Permanently delete the specified resource.
    public function forceDelete(string $complaint): RedirectResponse
    {
        $complaintModel = Complaint::withTrashed()->findOrFail($complaint);
        $this->authorize('forceDelete', $complaintModel);

        $this->complaintService->forceDeleteComplaint($complaint);

        return redirect()
            ->route('complaints.index')
            ->with('success', 'Complaint permanently deleted.');
    }

    // Store comment for the complaint
    public function storeComment(Request $request, Complaint $complaint)
    {
        $this->authorize('addComment', $complaint);

        $request->validate([
            'comment' => 'required|string|max:5000',
            'comment_type' => 'nullable|string|in:internal,external,resolution',
            'is_private' => 'boolean',
        ]);

        $complaint->comments()->create([
            'user_id' => Auth::id(),
            'created_by' => Auth::id(),
            'comment' => $request->comment,
            'comment_type' => $request->comment_type ?? 'external',
            'is_private' => $request->is_private ?? false,
        ]);

        return back()->with('success', 'Comment added successfully.');
    }

    // Store document for the complaint
    public function storeDocument(Request $request, Complaint $complaint)
    {
        $this->authorize('uploadDocument', $complaint);

        $request->validate([
            'document' => 'required|file|max:10240',
            'title' => 'nullable|string|max:255',
            'document_type' => 'nullable|string|max:50',
        ]);

        $path = $request->file('document')->store('complaints/'.$complaint->id, 'private');

        $complaint->documents()->create([
            'title' => $request->title ?? $request->file('document')->getClientOriginalName(),
            'doc_type' => $request->document_type,
            'file_path' => $path,
            'uploaded_by' => Auth::id(),
        ]);

        return back()->with('success', 'Document uploaded successfully.');
    }
}
