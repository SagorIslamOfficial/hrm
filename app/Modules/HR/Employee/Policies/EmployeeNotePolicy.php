<?php

namespace App\Modules\HR\Employee\Policies;

use App\Models\User;
use App\Modules\HR\Employee\Models\EmployeeNote;

class EmployeeNotePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, EmployeeNote $employeeNote): bool
    {
        // Public notes - anyone can view
        if (! $employeeNote->is_private) {
            return true;
        }

        // Private notes - check permissions
        // 1. Admins can view all private notes
        // 2. HR can view all private notes
        // 3. Note creators can view their own private notes
        // 4. Managers can view private notes (will be filtered by team in repository)
        return $user->hasPermissionTo('view-private-notes')
            || $employeeNote->created_by === $user->id
            || $user->hasRole(['Admin', 'HR']);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, EmployeeNote $employeeNote): bool
    {
        // Only admins, HR with manage permission, or the note creator can update
        return $user->hasPermissionTo('manage-private-notes')
            || $employeeNote->created_by === $user->id
            || $user->hasRole('Admin');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, EmployeeNote $employeeNote): bool
    {
        // Only admins, HR with manage permission, or the note creator can delete
        return $user->hasPermissionTo('manage-private-notes')
            || $employeeNote->created_by === $user->id
            || $user->hasRole('Admin');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, EmployeeNote $employeeNote): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, EmployeeNote $employeeNote): bool
    {
        return false;
    }
}
