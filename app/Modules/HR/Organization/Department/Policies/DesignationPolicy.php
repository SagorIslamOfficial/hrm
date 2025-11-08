<?php

namespace App\Modules\HR\Organization\Department\Policies;

use App\Models\User;
use App\Modules\HR\Organization\Department\Models\Designation;
use Illuminate\Auth\Access\HandlesAuthorization;

class DesignationPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole(['Admin', 'HR', 'Manager']);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Designation $designation): bool
    {
        return $user->hasRole(['Admin', 'HR', 'Manager']);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole(['Admin', 'HR']);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Designation $designation): bool
    {
        return $user->hasRole(['Admin', 'HR']);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Designation $designation): bool
    {
        return $user->hasRole(['Admin', 'HR']);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Designation $designation): bool
    {
        // only Admins can restore
        return $user->hasRole('Admin');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Designation $designation): bool
    {
        // only Admins can force delete
        return $user->hasRole('Admin');
    }
}
