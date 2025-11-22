<?php

namespace App\Modules\HR\Organization\Branch\Policies;

use App\Models\User;
use App\Modules\HR\Organization\Branch\Models\BranchDocument;

class BranchDocumentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole(['Admin', 'HR', 'Manager']);
    }

    public function view(User $user, BranchDocument $branchDocument): bool
    {
        return $user->hasRole(['Admin', 'HR', 'Manager']);
    }

    public function create(User $user): bool
    {
        return $user->hasRole(['Admin', 'HR']);
    }

    public function update(User $user, BranchDocument $branchDocument): bool
    {
        return $user->hasRole(['Admin', 'HR']);
    }

    public function delete(User $user, BranchDocument $branchDocument): bool
    {
        return $user->hasRole(['Admin', 'HR']);
    }

    public function download(User $user, BranchDocument $branchDocument): bool
    {
        return $user->hasRole(['Admin', 'HR', 'Manager']);
    }
}
