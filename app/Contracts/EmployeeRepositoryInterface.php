<?php

namespace App\Contracts;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

interface EmployeeRepositoryInterface
{
    public function find(int $id): ?User;

    public function getEmployees(): Collection;

    public function update(User $user, array $data): bool;
}
