<?php

namespace App\Modules\HR\Organization\Branch\Repositories;

use App\Modules\HR\Organization\Branch\Contracts\BranchRepositoryContract;
use App\Modules\HR\Organization\Branch\Models\Branch;

class BranchRepository implements BranchRepositoryContract
{
    public function create(array $data): Branch
    {
        return Branch::create($data);
    }

    public function findById(string $id): Branch
    {
        return Branch::with(['detail', 'settings', 'manager', 'parentBranch'])
            ->findOrFail($id);
    }

    public function update(Branch $branch, array $data): bool
    {
        return $branch->update($data);
    }

    public function delete(Branch $branch): bool
    {
        return $branch->delete();
    }

    public function restore(Branch $branch): bool
    {
        return $branch->restore();
    }

    public function forceDelete(Branch $branch): bool
    {
        return $branch->forceDelete();
    }
}
