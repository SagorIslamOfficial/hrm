<?php

namespace App\Modules\HR\Employee\Http\Controllers;

use App\Modules\HR\Employee\Contracts\EmployeeRepositoryInterface;
use App\Modules\HR\Employee\Http\Requests\StoreEmployeeRequest;
use App\Modules\HR\Employee\Http\Requests\UpdateEmployeeRequest;
use App\Modules\HR\Employee\Models\Employee;
use App\Modules\HR\Employee\Models\EmploymentType;
use App\Modules\HR\Employee\Services\EmployeeService;
use App\Modules\HR\Organization\Department\Models\Department;
use App\Modules\HR\Organization\Department\Models\Designation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class EmployeeController
{
    public function __construct(
        private EmployeeService $employeeService,
        private EmployeeRepositoryInterface $employeeRepository,
    ) {}

    public function index(Request $request)
    {
        $employees = Employee::select([
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
            ->orderBy('employees.created_at', 'desc')
            ->get();

        return Inertia::render('modules/employee/index', [
            'employees' => $employees,
        ]);
    }

    public function create()
    {
        $departments = Department::select('id', 'name')->get();
        $designations = Designation::select('id', 'title')->get();

        // Get active employment types
        $employmentTypes = EmploymentType::select('code', 'name')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('modules/employee/create', [
            'departments' => $departments,
            'designations' => $designations,
            'employmentTypes' => $employmentTypes,
            'auth' => [
                'user' => Auth::user()->load('roles'),
            ],
        ]);
    }

    public function store(StoreEmployeeRequest $request)
    {
        try {
            $data = $request->validated();

            $employee = $this->employeeService->createEmployee($data);

            // Handle photo upload if provided
            if ($request->hasFile('photo')) {
                try {
                    $success = $employee->uploadPhoto($request->file('photo'));
                    if (! $success) {
                        return redirect()->back()
                            ->withInput()
                            ->withErrors(['photo' => 'Failed to upload photo. Please try again.']);
                    }
                } catch (\Exception $e) {
                    // Log the error for debugging
                    Log::error('Photo upload failed during employee creation: '.$e->getMessage());

                    return redirect()->back()
                        ->withInput()
                        ->withErrors(['photo' => 'Photo upload failed. Please try again with a different image.']);
                }
            }

            // Redirect to edit page for comprehensive data entry
            return redirect()->route('employees.edit', $employee->id)
                ->with('success', 'Employee created successfully. Please complete the profile information.');
        } catch (\Exception $e) {
            Log::error('Employee creation failed: '.$e->getMessage());

            return redirect()->back()
                ->withInput()
                ->withErrors(['general' => 'Failed to create employee. Please try again.']);
        }
    }

    public function show(int|string $id)
    {
        $employee = $this->employeeRepository->findById($id)->load([
            'department',
            'designation',
            'personalDetail',
            'jobDetail',
            'salaryDetail',
            'contacts',
            'documents.uploader:id,name',
            'notes' => fn ($query) => $query->with(['creator:id,name', 'updater:id,name'])->latest(),
            'attendanceRecords' => fn ($query) => $query->latest()->limit(30),
            'leaveRecords' => fn ($query) => $query->latest()->limit(10),
            'customFields',
        ]);

        $supervisors = $this->employeeRepository->all()
            ->where('id', '!=', $id)
            ->map(fn ($emp) => [
                'id' => $emp->id,
                'name' => $emp->full_name,
                'employee_code' => $emp->employee_code,
            ])
            ->values();

        return Inertia::render('modules/employee/show', [
            'employee' => $employee,
            'supervisors' => $supervisors,
            'currency' => $employee->currency ?? 'BDT',
            'auth' => [
                'user' => Auth::user()->load('roles'),
            ],
        ]);
    }

    public function edit(int|string $id)
    {
        $employee = $this->employeeRepository->findById($id)->load([
            'department',
            'designation',
            'personalDetail',
            'jobDetail',
            'salaryDetail',
            'contacts',
            'documents.uploader:id,name',
            'notes' => fn ($query) => $query->with(['creator:id,name', 'updater:id,name'])->latest(),
            'customFields',
        ]);

        $departments = Department::select('id', 'name')->get();
        $designations = Designation::select('id', 'title')->get();

        // Get active employment types
        $employmentTypes = EmploymentType::select('code', 'name')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        $supervisors = $this->employeeRepository->all()
            ->where('id', '!=', $id)
            ->map(fn ($emp) => [
                'id' => $emp->id,
                'name' => $emp->full_name,
                'employee_code' => $emp->employee_code,
            ])
            ->values();

        return Inertia::render('modules/employee/edit', [
            'employee' => $employee,
            'departments' => $departments,
            'designations' => $designations,
            'employmentTypes' => $employmentTypes,
            'supervisors' => $supervisors,
            'currency' => $employee->currency ?? 'BDT',
            'auth' => [
                'user' => Auth::user()->load('roles'),
            ],
        ]);
    }

    public function update(UpdateEmployeeRequest $request, int|string $id)
    {
        try {
            $employee = $this->employeeService->updateEmployee($id, $request->validated());

            // Handle photo upload if provided
            if ($request->hasFile('photo')) {
                try {
                    $success = $employee->uploadPhoto($request->file('photo'));
                    if (! $success) {
                        return redirect()->back()
                            ->withInput()
                            ->withErrors(['photo' => 'Failed to upload photo. Please try again.']);
                    }
                } catch (\Exception $e) {
                    Log::error('Photo upload failed during employee update: '.$e->getMessage());

                    return redirect()->back()
                        ->withInput()
                        ->withErrors(['photo' => 'Photo upload failed. Please try again with a different image.']);
                }
            }

            // Handle photo deletion if requested
            if ($request->boolean('delete_photo')) {
                try {
                    $success = $employee->deletePhoto();
                    if (! $success) {
                        return redirect()->back()
                            ->withErrors(['photo' => 'Failed to delete photo. Please try again.']);
                    }
                } catch (\Exception $e) {
                    Log::error('Photo deletion failed during employee update: '.$e->getMessage());

                    return redirect()->back()
                        ->withErrors(['photo' => 'Photo deletion failed. Please try again.']);
                }
            }

            return redirect()->route('employees.show', $employee->id)
                ->with('success', 'Employee updated successfully.');
        } catch (\Exception $e) {
            Log::error('Employee update failed: '.$e->getMessage());

            return redirect()->back()
                ->withInput()
                ->withErrors(['general' => 'Failed to update employee. Please try again.']);
        }
    }

    public function destroy(int|string $id)
    {
        $this->employeeService->deleteEmployee($id);

        return redirect()->route('employees.index')
            ->with('success', 'Employee deleted successfully.');
    }
}
