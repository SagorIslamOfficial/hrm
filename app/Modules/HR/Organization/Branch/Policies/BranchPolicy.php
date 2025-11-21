<?php

namespace App\Modules\HR\Organization\Branch\Policies;

use App\Models\User;
use App\Modules\HR\Organization\Branch\Models\Branch;

class BranchPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole(['Admin', 'HR', 'Manager']);
    }

    public function view(User $user, Branch $branch): bool
    {
        return $user->hasRole(['Admin', 'HR', 'Manager']);
    }

    public function create(User $user): bool
    {
        return $user->hasRole(['Admin', 'HR']);
    }

    public function update(User $user, Branch $branch): bool
    {
        return $user->hasRole(['Admin', 'HR']);
    }

    public function delete(User $user, Branch $branch): bool
    {
        return $user->hasRole(['Admin', 'HR']);
    }

    public function restore(User $user, Branch $branch): bool
    {
        // only Admins can restore
        return $user->hasRole('Admin');
    }

    public function forceDelete(User $user, Branch $branch): bool
    {
        // only Admins can force delete
        return $user->hasRole('Admin');
    }
}
