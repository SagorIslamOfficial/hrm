<?php

namespace App\Modules\HR\Organization\Branch\Contracts;

use App\Modules\HR\Organization\Branch\Models\Branch;

interface BranchRepositoryContract
{
    public function create(array $data): Branch;

    public function findById(string $id): Branch;

    public function update(Branch $branch, array $data): bool;

    public function delete(Branch $branch): bool;

    public function restore(Branch $branch): bool;

    public function forceDelete(Branch $branch): bool;
}
