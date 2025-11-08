<?php

namespace App\Modules\HR\Organization\Department\Http\Controllers;

use App\Modules\HR\Employee\Models\Employee;
use App\Modules\HR\Organization\Department\Contracts\DepartmentRepositoryInterface;
use App\Modules\HR\Organization\Department\Http\Requests\StoreDepartmentRequest;
use App\Modules\HR\Organization\Department\Http\Requests\UpdateDepartmentRequest;
use App\Modules\HR\Organization\Department\Models\Department;
use App\Modules\HR\Organization\Department\Services\DepartmentService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DepartmentController
{
    use AuthorizesRequests;

    public function __construct(
        private DepartmentService $departmentService,
        private DepartmentRepositoryInterface $departmentRepository,
    ) {}

    public function index()
    {
        $this->authorize('viewAny', Department::class);
        $departments = Department::with([
            'manager' => function ($query) {
                $query->select('id', 'first_name', 'last_name', 'photo');
            },
            'employees'
        ])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('modules/department/index', compact('departments'));
    }

    public function create()
    {
        $this->authorize('create', Department::class);

        $employees = Employee::select('id', 'first_name', 'last_name', 'email')->get();

        return Inertia::render('modules/department/create', [
            'employees' => $employees,
        ]);
    }

    public function store(StoreDepartmentRequest $request)
    {
        $this->authorize('create', Department::class);
        $department = $this->departmentService->createDepartment($request->validated());

        return redirect()->route('departments.show', $department->id)
            ->with('success', 'Department created successfully.');
    }

    public function show(string $id)
    {
        $department = $this->departmentRepository->findById($id);
        $this->authorize('view', $department);
        $stats = $this->departmentService->getDepartmentStats($id);

        $department->load([
            'detail',
            'settings',
            'notes.creator',
            'notes.updater',
            'designations',
            'manager' => function ($query) {
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
                    'designations.title as designation_title',
                ])
                    ->leftJoin('departments', 'employees.department_id', '=', 'departments.id')
                    ->leftJoin('designations', 'employees.designation_id', '=', 'designations.id');
            },
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
                    'designations.title as designation_title',
                ])
                    ->leftJoin('departments', 'employees.department_id', '=', 'departments.id')
                    ->leftJoin('designations', 'employees.designation_id', '=', 'designations.id')
                    ->orderBy('employees.created_at', 'desc');
            },
        ]);

        return Inertia::render('modules/department/show', [
            'department' => $department,
            'stats' => $stats,
        ]);
    }

    public function edit(string $id)
    {
        $department = $this->departmentRepository->findById($id);
        $this->authorize('update', $department);

        $department->load([
            'detail',
            'settings',
            'notes.creator',
            'notes.updater',
            'designations',
            'manager',
        ]);

        $employees = Employee::select('id', 'first_name', 'last_name', 'email')->get();

        return Inertia::render('modules/department/edit', [
            'department' => $department,
            'employees' => $employees,
            'currentUser' => Auth::user(),
        ]);
    }

    public function update(UpdateDepartmentRequest $request, string $id)
    {
        $department = $this->departmentService->updateDepartment($id, $request->validated());
        $this->authorize('update', $department);

        return redirect()->route('departments.show', $department->id)
            ->with('success', 'Department updated successfully.');
    }

    public function destroy(string $id)
    {
        $department = $this->departmentRepository->findById($id);
        $this->authorize('delete', $department);
        $this->departmentService->deleteDepartment($id);

        return redirect()->route('departments.index')
            ->with('success', 'Department deleted successfully.');
    }

    public function restore(string $id)
    {
        $department = Department::withTrashed()->findOrFail($id);
        $this->authorize('restore', $department);
        $this->departmentService->restoreDepartment($id);

        return redirect()->route('departments.index')
            ->with('success', 'Department restored successfully.');
    }

    public function forceDelete(string $id)
    {
        $department = Department::withTrashed()->findOrFail($id);
        $this->authorize('forceDelete', $department);
        $this->departmentService->forceDeleteDepartment($id);

        return redirect()->route('departments.index')
            ->with('success', 'Department permanently deleted.');
    }
}
