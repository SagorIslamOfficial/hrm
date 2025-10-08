<?php

namespace App\Modules\Employee\Services;

use App\Contracts\EmployeeRepositoryInterface;
use App\Contracts\EmployeeServiceInterface;
use App\Models\User;

class EmployeeService implements EmployeeServiceInterface
{
    public function __construct(
        private EmployeeRepositoryInterface $employeeRepository
    ) {}

    /**
     * Get employee profile data.
     */
    public function getProfile(User $user): array
    {
        // Assuming Employee model exists later
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ];
    }

    /**
     * Update employee details.
     */
    public function updateEmployee(User $user, array $data): User
    {
        $this->employeeRepository->update($user, $data);

        return $user->fresh();
    }
}
