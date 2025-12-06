<?php

namespace App\Observers;

use App\Models\User;

class UserObserver
{
    /**
     * Handle the User "updated" event.
     * Sync status changes to linked employee employment_status.
     */
    public function updated(User $user): void
    {
        // If status changed and user has a linked employee, sync the status
        if ($user->isDirty('status') && $user->employee) {
            $user->employee->update(['employment_status' => $user->status]);
        }
    }

    /**
     * Handle the User "created" event.
     * Ensure initial status is synced if employee is already linked.
     */
    public function created(User $user): void
    {
        // If user is created with a linked employee, sync the status
        if ($user->employee && $user->status) {
            $user->employee->update(['employment_status' => $user->status]);
        }
    }
}
