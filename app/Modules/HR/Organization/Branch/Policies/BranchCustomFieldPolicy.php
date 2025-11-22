<?php

namespace App\Modules\HR\Organization\Branch\Policies;

use App\Models\User;
use App\Modules\HR\Organization\Branch\Models\BranchCustomField;

class BranchCustomFieldPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole(['Admin', 'HR', 'Manager']);
    }

    public function view(User $user, BranchCustomField $branchCustomField): bool
    {
        return $user->hasRole(['Admin', 'HR', 'Manager']);
    }

    public function create(User $user): bool
    {
        return $user->hasRole(['Admin', 'HR']);
    }

    public function update(User $user, BranchCustomField $branchCustomField): bool
    {
        return $user->hasRole(['Admin', 'HR']);
    }

    public function delete(User $user, BranchCustomField $branchCustomField): bool
    {
        return $user->hasRole(['Admin', 'HR']);
    }

    public function sync(User $user): bool
    {
        return $user->hasRole(['Admin', 'HR']);
    }
}
