<?php

namespace App\Modules\HR\Organization\Department\Policies;

use App\Models\User;
use App\Modules\HR\Organization\Department\Models\Department;

class DepartmentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole(['Admin', 'HR', 'Manager']);
    }

    public function view(User $user, Department $department): bool
    {
        return $user->hasRole(['Admin', 'HR', 'Manager']);
    }

    public function create(User $user): bool
    {
        return $user->hasRole(['Admin', 'HR']);
    }

    public function update(User $user, Department $department): bool
    {
        return $user->hasRole(['Admin', 'HR']);
    }

    public function delete(User $user, Department $department): bool
    {
        return $user->hasRole(['Admin', 'HR']);
    }

    public function restore(User $user, Department $department): bool
    {
        // only Admins can restore
        return $user->hasRole('Admin');
    }

    public function forceDelete(User $user, Department $department): bool
    {
        // only Admins can force delete
        return $user->hasRole('Admin');
    }
}
