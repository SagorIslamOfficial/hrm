<?php

namespace App\Modules\Employee\Http\Controllers;

use App\Modules\Employee\Http\Requests\StoreEmploymentTypeRequest;
use App\Modules\Employee\Http\Requests\UpdateEmploymentTypeRequest;
use App\Modules\Employee\Models\EmploymentType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmploymentTypeController
{
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
        $employmentType->load(['employees' => fn ($query) => $query->select('id', 'first_name', 'last_name', 'employee_code')]);
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
