<?php

namespace App\Modules\HR\Organization\Department\Database\Seeders;

use App\Modules\HR\Employee\Models\Employee;
use App\Modules\HR\Organization\Department\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentManagerSeeder extends Seeder
{
    public function run(): void
    {
        $departments = Department::where('is_active', true)->get();
        $employees = Employee::all();

        if ($departments->isEmpty()) {
            return;
        }

        if ($employees->isEmpty()) {
            return;
        }

        // Assign managers to departments
        foreach ($departments as $department) {
            $availableManagers = $employees->filter(function ($employee) use ($department) {
                return $employee->department_id === $department->id ||
                       is_null(Employee::where('id', $employee->id)->first()?->department?->manager_id);
            });

            if ($availableManagers->isNotEmpty()) {
                $manager = $availableManagers->random();

                $department->update([
                    'manager_id' => $manager->id,
                ]);
            }
        }
    }
}
