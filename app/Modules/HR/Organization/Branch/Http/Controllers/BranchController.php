<?php

namespace App\Modules\HR\Organization\Branch\Http\Controllers;

use App\Modules\HR\Employee\Models\Employee;
use App\Modules\HR\Organization\Branch\Contracts\BranchRepositoryContract;
use App\Modules\HR\Organization\Branch\Http\Requests\StoreBranchRequest;
use App\Modules\HR\Organization\Branch\Http\Requests\UpdateBranchRequest;
use App\Modules\HR\Organization\Branch\Models\Branch;
use App\Modules\HR\Organization\Branch\Services\BranchService;
use App\Modules\HR\Organization\Department\Models\Department;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BranchController
{
    use AuthorizesRequests;

    public function __construct(
        private BranchService $branchService,
        private BranchRepositoryContract $branchRepository,
    ) {}

    public function index()
    {
        $this->authorize('viewAny', Branch::class);

        $branches = Branch::with([
            'manager' => function ($query) {
                $query->select('id', 'first_name', 'last_name', 'photo');
            },
            'departments' => function ($query) {
                $query->withCount('employees');
            },
            'detail',
        ])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('modules/branch/index', [
            'branches' => $branches,
            'branchTypes' => config('branch.types'),
        ]);
    }

    public function create()
    {
        $this->authorize('create', Branch::class);

        $employees = Employee::select('id', 'first_name', 'last_name', 'email', 'employee_code')
            ->where('employment_status', 'active')
            ->get();

        $departments = Department::select('id', 'name', 'code')
            ->where('is_active', true)
            ->get();

        $branches = Branch::select('id', 'name', 'code', 'type')
            ->where('is_active', true)
            ->get();

        // Convert config to dropdown format
        $branchTypes = collect(config('branch.types'))
            ->map(fn ($label, $value) => ['value' => $value, 'label' => $label])
            ->values()
            ->toArray();

        return Inertia::render('modules/branch/create', [
            'employees' => $employees,
            'departments' => $departments,
            'branches' => $branches,
            'branchTypes' => $branchTypes,
        ]);
    }

    public function store(StoreBranchRequest $request)
    {
        $this->authorize('create', Branch::class);
        $branch = $this->branchService->createBranch($request->validated());

        // Handle photo upload if provided
        if ($request->hasFile('property_contact_photo')) {
            try {
                $success = $branch->detail->uploadPhoto($request->file('property_contact_photo'));
                if (! $success) {
                    return redirect()->back()
                        ->withInput()
                        ->withErrors(['property_contact_photo' => 'Failed to upload photo. Please try again.']);
                }
            } catch (\Exception $e) {
                return redirect()->back()
                    ->withInput()
                    ->withErrors(['property_contact_photo' => 'Photo upload failed. Please try again with a different image.']);
            }
        }

        return redirect()->route('branches.show', $branch->id)
            ->with('success', 'Branch created successfully.');
    }

    public function show(string $id)
    {
        $branch = $this->branchRepository->findById($id);
        $this->authorize('view', $branch);
        $stats = $this->branchService->getBranchStats($id);
        $hierarchy = $this->branchService->getBranchHierarchy($id);

        // Common employee columns for consistency
        $employeeColumns = [
            'employees.id',
            'employees.employee_code',
            'employees.first_name',
            'employees.last_name',
            'employees.email',
            'employees.phone',
            'employees.photo',
            'employees.employment_status',
            'employees.department_id',
            'employees.designation_id',
        ];

        $branch->load([
            'detail',
            'settings',
            'notes.creator',
            'notes.updater',
            'documents.uploader:id,name',
            'customFields',
            'parentBranch',
            'childBranches' => function ($query) {
                $query->select('id', 'name', 'code', 'type', 'parent_id', 'is_active', 'city', 'country');
            },
            'manager' => function ($query) use ($employeeColumns) {
                $query->select($employeeColumns)
                    ->leftJoin('departments', 'employees.department_id', '=', 'departments.id')
                    ->leftJoin('designations', 'employees.designation_id', '=', 'designations.id')
                    ->addSelect([
                        'departments.name as department_name',
                        'designations.title as designation_title',
                    ]);
            },
            'departments' => function ($query) {
                $query->select(
                    'departments.id',
                    'departments.name',
                    'departments.code',
                    'departments.is_active',
                    'departments.budget',
                    'departments.manager_id',
                )
                    ->withCount('employees')
                    ->with('detail')
                    ->with([
                        'manager' => function ($managerQuery) {
                            $managerQuery->select('id', 'first_name', 'last_name', 'photo');
                        },
                    ])
                    ->with(['employees' => function ($query) {
                        $query->select([
                            'employees.id',
                            'employees.employee_code',
                            'employees.first_name',
                            'employees.last_name',
                            'employees.email',
                            'employees.phone',
                            'employees.photo',
                            'employees.employment_status',
                            'employees.department_id',
                            'employees.designation_id',
                        ])
                            ->leftJoin('departments', 'employees.department_id', '=', 'departments.id')
                            ->leftJoin('designations', 'employees.designation_id', '=', 'designations.id')
                            ->addSelect([
                                'departments.name as department_name',
                                'designations.title as designation_title',
                            ])
                            ->orderBy('employees.first_name');
                    }])
                    ->withPivot([
                        'id',
                        'budget_allocation',
                        'is_primary',
                    ]);
            },
        ])->loadCount('departments');

        return Inertia::render('modules/branch/show', [
            'branch' => $branch,
            'stats' => $stats,
            'hierarchy' => $hierarchy,
        ]);
    }

    public function edit(string $id)
    {
        $branch = $this->branchRepository->findById($id);
        $this->authorize('update', $branch);

        $branch->load([
            'detail',
            'settings',
            'notes.creator',
            'notes.updater',
            'documents.uploader:id,name',
            'customFields',
            'manager',
            'parentBranch',
            'departments' => function ($query) {
                $query->select(
                    'departments.id',
                    'departments.name',
                    'departments.code',
                    'departments.is_active',
                    'departments.manager_id'
                )
                    ->withCount('employees')
                    ->with('detail')
                    ->with('manager:id,first_name,last_name')
                    ->withPivot([
                        'id',
                        'budget_allocation',
                        'is_primary',
                    ]);
            },
        ]);

        $employees = Employee::select('id', 'first_name', 'last_name', 'email', 'employee_code')
            ->where('employment_status', 'active')
            ->get();

        $departments = Department::select('id', 'name', 'code', 'is_active', 'budget', 'manager_id')
            ->where('is_active', true)
            ->with('manager:id,first_name,last_name')
            ->get();

        $branches = Branch::select('id', 'name', 'code', 'type')
            ->where('is_active', true)
            ->where('id', '!=', $id)
            ->get();

        $branchTypes = collect(config('branch.types'))
            ->map(fn ($label, $value) => ['value' => $value, 'label' => $label])
            ->values()
            ->toArray();

        return Inertia::render('modules/branch/edit', [
            'branch' => $branch,
            'employees' => $employees,
            'departments' => $departments,
            'branches' => $branches,
            'branchTypes' => $branchTypes,
            'currentUser' => Auth::user(),
        ]);
    }

    public function update(UpdateBranchRequest $request, string $id)
    {
        // Fetch branch and authorize BEFORE making any changes
        $branch = $this->branchRepository->findById($id);
        $this->authorize('update', $branch);

        // Perform the update
        $branch = $this->branchService->updateBranch($id, $request->validated());

        // Handle photo upload if provided
        if ($request->hasFile('property_contact_photo')) {
            try {
                $success = $branch->detail->uploadPhoto($request->file('property_contact_photo'));
                if (! $success) {
                    return redirect()->back()
                        ->withInput()
                        ->withErrors(['property_contact_photo' => 'Failed to upload photo. Please try again.']);
                }
            } catch (\Exception $e) {
                return redirect()->back()
                    ->withInput()
                    ->withErrors(['property_contact_photo' => 'Photo upload failed. Please try again with a different image.']);
            }
        }

        // Handle photo deletion if requested
        if ($request->boolean('delete_property_contact_photo')) {
            try {
                $success = $branch->detail->deletePhoto();
                if (! $success) {
                    return redirect()->back()
                        ->withErrors(['property_contact_photo' => 'Failed to delete photo. Please try again.']);
                }
            } catch (\Exception $e) {
                return redirect()->back()
                    ->withErrors(['property_contact_photo' => 'Photo deletion failed. Please try again.']);
            }
        }

        return redirect()->route('branches.show', $branch->id)
            ->with('success', 'Branch updated successfully.');
    }

    public function destroy(string $id)
    {
        $branch = $this->branchRepository->findById($id);
        $this->authorize('delete', $branch);

        try {
            $this->branchService->deleteBranch($id);

            return redirect()->route('branches.index')
                ->with('success', 'Branch deleted successfully.');
        } catch (\RuntimeException $e) {
            return redirect()->back()
                ->with('error', $e->getMessage());
        }
    }

    public function restore(string $id)
    {
        $branch = Branch::withTrashed()->findOrFail($id);
        $this->authorize('restore', $branch);
        $this->branchService->restoreBranch($id);

        return redirect()->route('branches.index')
            ->with('success', 'Branch restored successfully.');
    }

    public function forceDelete(string $id)
    {
        $branch = Branch::withTrashed()->findOrFail($id);
        $this->authorize('forceDelete', $branch);
        $this->branchService->forceDeleteBranch($id);

        return redirect()->route('branches.index')
            ->with('success', 'Branch permanently deleted.');
    }
}
