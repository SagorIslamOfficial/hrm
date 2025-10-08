<?php

namespace App\Modules\Employee\Repositories;

use App\Contracts\EmployeeRepositoryInterface;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class EmployeeRepository implements EmployeeRepositoryInterface
{
    public function find(int $id): ?User
    {
        return User::find($id);
    }

    public function getEmployees(): Collection
    {
        return User::whereHas('roles', function ($query) {
            $query->where('name', 'Employee');
        })->get();
    }

    public function update(User $user, array $data): bool
    {
        return $user->update($data);
    }
}
