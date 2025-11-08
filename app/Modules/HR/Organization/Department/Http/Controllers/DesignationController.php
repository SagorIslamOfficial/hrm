<?php

namespace App\Modules\HR\Organization\Department\Http\Controllers;

use App\Modules\HR\Organization\Department\Contracts\DesignationRepositoryInterface;
use App\Modules\HR\Organization\Department\Http\Requests\StoreDesignationRequest;
use App\Modules\HR\Organization\Department\Http\Requests\UpdateDesignationRequest;
use App\Modules\HR\Organization\Department\Models\Department;
use App\Modules\HR\Organization\Department\Models\Designation;
use App\Modules\HR\Organization\Department\Services\DesignationService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DesignationController
{
    use AuthorizesRequests;

    public function __construct(
        private DesignationService $designationService,
        private DesignationRepositoryInterface $designationRepository,
    ) {}

    public function index()
    {
        $this->authorize('viewAny', Designation::class);
        $designations = $this->designationRepository->all();

        return Inertia::render('modules/department/designation/index', compact('designations'));
    }

    public function create()
    {
        $this->authorize('create', Designation::class);

        $departments = Department::select('id', 'name')->get();

        return Inertia::render('modules/department/designation/create', [
            'departments' => $departments,
        ]);
    }

    public function store(StoreDesignationRequest $request)
    {
        $this->authorize('create', Designation::class);
        $designation = $this->designationService->createDesignation($request->validated());

        return redirect()->route('designations.show', $designation->id)
            ->with('success', 'Designation created successfully.');
    }

    public function show(string $id)
    {
        $designation = $this->designationRepository->findById($id);
        $this->authorize('view', $designation);

        // Load relationships
        $designation->load([
            'department',
            'employees' => function ($query) {
                $query->select([
                    'employees.id',
                    'employees.employee_code',
                    'employees.first_name',
                    'employees.last_name',
                    'employees.email',
                    'employees.phone',
                    'employees.photo',
                    'employees.employment_status',
                    'employees.employment_type',
                    'employees.joining_date',
                    'employees.created_at',
                    'employees.department_id',
                    'employees.designation_id',
                    'departments.name as department_name',
                ])
                    ->leftJoin('departments', 'employees.department_id', '=', 'departments.id')
                    ->orderBy('employees.created_at', 'desc')
                    ->limit(10);
            },
        ]);

        // Calculate stats after loading relationships
        $stats = [
            'id' => $designation->id,
            'title' => $designation->title,
            'code' => $designation->code,
            'employee_count' => $designation->employees()->count(), // Count all employees, not just loaded ones
            'department' => $designation->department?->name ?? null,
            'is_active' => $designation->is_active,
        ];

        return Inertia::render('modules/department/designation/show', [
            'designation' => $designation,
            'stats' => $stats,
        ]);
    }

    public function edit(string $id)
    {
        $designation = $this->designationRepository->findById($id);
        $this->authorize('update', $designation);

        $departments = Department::select('id', 'name')->get();

        return Inertia::render('modules/department/designation/edit', [
            'designation' => $designation,
            'departments' => $departments,
            'currentUser' => Auth::user(),
        ]);
    }

    public function update(UpdateDesignationRequest $request, string $id)
    {
        $designation = $this->designationService->updateDesignation($id, $request->validated());
        $this->authorize('update', $designation);

        return redirect()->route('designations.show', $designation->id)
            ->with('success', 'Designation updated successfully.');
    }

    public function destroy(string $id)
    {
        $designation = $this->designationRepository->findById($id);
        $this->authorize('delete', $designation);
        $this->designationService->deleteDesignation($id);

        return redirect()->route('designations.index')
            ->with('success', 'Designation deleted successfully.');
    }

    public function restore(string $id)
    {
        $designation = Designation::withTrashed()->findOrFail($id);
        $this->authorize('restore', $designation);
        $this->designationService->restoreDesignation($id);

        return redirect()->route('designations.index')
            ->with('success', 'Designation restored successfully.');
    }

    public function forceDelete(string $id)
    {
        $designation = Designation::withTrashed()->findOrFail($id);
        $this->authorize('forceDelete', $designation);
        $this->designationService->forceDeleteDesignation($id);

        return redirect()->route('designations.index')
            ->with('success', 'Designation permanently deleted.');
    }
}
