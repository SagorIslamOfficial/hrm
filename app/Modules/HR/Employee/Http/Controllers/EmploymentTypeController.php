<?php

namespace App\Modules\HR\Employee\Http\Controllers;

use App\Modules\HR\Employee\Http\Requests\StoreEmploymentTypeRequest;
use App\Modules\HR\Employee\Http\Requests\UpdateEmploymentTypeRequest;
use App\Modules\HR\Employee\Models\EmploymentType;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmploymentTypeController
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $employmentTypes = EmploymentType::query()
            ->select([
                'id',
                'name',
                'code',
                'description',
                'is_active',
                'created_at',
            ])
            ->withCount('employees')
            ->orderBy(column: 'created_at', direction: 'desc')
            ->get();

        return Inertia::render('modules/employee/employment-types/index', [
            'employmentTypes' => $employmentTypes,
        ]);
    }

    public function create()
    {
        return Inertia::render('modules/employee/employment-types/create');
    }

    public function store(StoreEmploymentTypeRequest $request)
    {
        $data = $request->validated();

        EmploymentType::create($data);

        return redirect()->route('employment-types.index')
            ->with('success', 'Employment type created successfully.');
    }

    public function show(EmploymentType $employmentType)
    {
        $employmentType->load(['employees' => function ($query) {
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
        }]);
        $employmentType->employees_count = $employmentType->employees()->count();

        return Inertia::render('modules/employee/employment-types/show', [
            'employmentType' => $employmentType,
        ]);
    }

    public function edit(EmploymentType $employmentType)
    {
        return Inertia::render('modules/employee/employment-types/edit', [
            'employmentType' => $employmentType,
        ]);
    }

    public function update(UpdateEmploymentTypeRequest $request, EmploymentType $employmentType)
    {
        $data = $request->validated();

        $employmentType->update($data);

        return redirect()->route('employment-types.index', $employmentType->id)
            ->with('success', 'Employment type updated successfully.');
    }

    public function destroy(EmploymentType $employmentType)
    {
        // Check if employment type is being used by employees
        if ($employmentType->employees()->exists()) {
            return redirect()->route('employment-types.index')
                ->with('error', 'Cannot delete employment type that is currently assigned to employees.');
        }

        $employmentType->delete();

        return redirect()->route('employment-types.index')
            ->with('success', 'Employment type deleted successfully.');
    }
}
