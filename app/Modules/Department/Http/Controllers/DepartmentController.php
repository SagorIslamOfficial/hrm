<?php

namespace App\Modules\Department\Http\Controllers;

use App\Modules\Department\Contracts\DepartmentRepositoryInterface;
use App\Modules\Department\Http\Requests\StoreDepartmentRequest;
use App\Modules\Department\Http\Requests\UpdateDepartmentRequest;
use App\Modules\Department\Services\DepartmentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartmentController
{
    public function __construct(
        private DepartmentService $departmentService,
        private DepartmentRepositoryInterface $departmentRepository,
    ) {}

    public function index(Request $request)
    {
        $departments = $this->departmentRepository->paginate($request->get('per_page', 15));

        return Inertia::render('modules/department/index', [
            'departments' => $departments,
        ]);
    }

    public function create()
    {
        return Inertia::render('modules/department/create');
    }

    public function store(StoreDepartmentRequest $request)
    {
        $department = $this->departmentService->createDepartment($request->validated());

        return redirect()->route('departments.show', $department->id)
            ->with('success', 'Department created successfully.');
    }

    public function show(int $id)
    {
        $department = $this->departmentRepository->findById($id);
        $stats = $this->departmentService->getDepartmentStats($id);

        return Inertia::render('modules/department/show', [
            'department' => $department,
            'stats' => $stats,
        ]);
    }

    public function edit(int $id)
    {
        $department = $this->departmentRepository->findById($id);

        return Inertia::render('modules/department/edit', [
            'department' => $department,
        ]);
    }

    public function update(UpdateDepartmentRequest $request, int $id)
    {
        $department = $this->departmentService->updateDepartment($id, $request->validated());

        return redirect()->route('departments.show', $department->id)
            ->with('success', 'Department updated successfully.');
    }

    public function destroy(int $id)
    {
        $this->departmentService->deleteDepartment($id);

        return redirect()->route('departments.index')
            ->with('success', 'Department deleted successfully.');
    }
}
