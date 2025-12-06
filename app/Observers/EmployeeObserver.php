<?php

namespace App\Observers;

use App\Modules\HR\Employee\Models\Employee;

class EmployeeObserver
{
    /**
     * Handle the Employee "updated" event.
     * Sync employment_status changes to linked user status.
     */
    public function updated(Employee $employee): void
    {
        // If employment_status changed and employee has a linked user, sync the status
        if ($employee->isDirty('employment_status') && $employee->user) {
            $employee->user->update(['status' => $employee->employment_status]);
        }
    }

    /**
     * Handle the Employee "created" event.
     * Ensure initial status is synced if user is already linked.
     */
    public function created(Employee $employee): void
    {
        // If employee is created with a linked user, sync the status
        if ($employee->user && $employee->employment_status) {
            $employee->user->update(['status' => $employee->employment_status]);
        }
    }
}
