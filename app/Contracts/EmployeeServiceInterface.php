<?php

namespace App\Contracts;

use App\Models\User;

interface EmployeeServiceInterface
{
    public function getProfile(User $user): array;

    public function updateEmployee(User $user, array $data): User;
}
