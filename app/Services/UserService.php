<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserActivityLog;
use App\Modules\HR\Employee\Models\Employee;
use App\Notifications\UserCreatedNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class UserService
{
    /**
     * Create a new user with optional employee linking.
     *
     * @param  array{name: string, email: string, password?: string, role?: string, employee_id?: string, status?: string, send_credentials?: bool}  $data
     */
    public function createUser(array $data): User
    {
        return DB::transaction(function () use ($data) {
            // Generate password if not provided
            $plainPassword = $data['password'] ?? Str::random(12);

            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($plainPassword),
                'employee_id' => $data['employee_id'] ?? null,
                'status' => $data['status'] ?? 'active',
                'created_by' => Auth::id(),
            ]);

            // Assign role if provided
            if (! empty($data['role'])) {
                $user->assignRole($data['role']);
            }

            // Sync email and status with employee if linked
            if ($user->employee_id) {
                $this->syncEmailToEmployee($user);
            }

            // Log activity
            $this->logActivity($user, 'add', 'User account created', [
                'name' => $user->name,
                'email' => $user->email,
                'employee_id' => $user->employee_id,
                'employee_code' => $user->employee?->employee_code,
                'role' => $data['role'] ?? null,
            ]);

            // Send credentials notification
            if ($data['send_credentials'] ?? true) {
                $user->notify(new UserCreatedNotification($plainPassword));
            }

            return $user;
        });
    }

    /**
     * Update an existing user.
     *
     * @param  array{name?: string, email?: string, password?: string, role?: string, employee_id?: string, status?: string}  $data
     */
    public function updateUser(User $user, array $data): User
    {
        return DB::transaction(function () use ($user, $data) {
            $updateData = [
                'name' => $data['name'] ?? $user->name,
            ];

            $changedData = [];

            // Handle email change with history tracking
            if (isset($data['email']) && $data['email'] !== $user->email) {
                $changedData['email'] = ['from' => $user->email, 'to' => $data['email']];
                $updateData['previous_email'] = $user->email;
                $updateData['email'] = $data['email'];
                $updateData['email_verified_at'] = null;
            }

            // Handle password change
            if (! empty($data['password'])) {
                $updateData['password'] = Hash::make($data['password']);
                $changedData['password'] = 'changed';
            }

            // Handle status change
            if (isset($data['status']) && $data['status'] !== $user->status) {
                $changedData['status'] = ['from' => $user->status, 'to' => $data['status']];
                $updateData['status'] = $data['status'];
            }

            // Handle employee linking/unlinking
            $oldEmployeeId = $user->employee_id;
            if (array_key_exists('employee_id', $data)) {
                $updateData['employee_id'] = $data['employee_id'];
                if ($data['employee_id'] !== $oldEmployeeId) {
                    // Get employee details for logging
                    $oldEmployee = null;
                    $newEmployee = null;

                    if ($oldEmployeeId) {
                        $oldEmployee = Employee::find($oldEmployeeId);
                    }

                    if ($data['employee_id']) {
                        $newEmployee = Employee::find($data['employee_id']);
                    }

                    $changedData['employee_id'] = [
                        'from' => $oldEmployee ? "{$oldEmployee->first_name} {$oldEmployee->last_name} ({$oldEmployee->employee_code})" : null,
                        'to' => $newEmployee ? "{$newEmployee->first_name} {$newEmployee->last_name} ({$newEmployee->employee_code})" : null,
                    ];
                }
            }

            $user->update($updateData);

            // Update role if provided
            if (isset($data['role'])) {
                $oldRole = $user->roles->first()?->name;
                $user->syncRoles([$data['role']]);
                if ($data['role'] !== $oldRole) {
                    $changedData['role'] = ['from' => $oldRole, 'to' => $data['role']];
                }
            }

            // Sync email and status with employee if linked
            if ($user->employee_id) {
                $this->syncEmailToEmployee($user);
            }

            // Log activity if anything changed
            if (! empty($changedData)) {
                $description = $this->buildUpdateDescription($changedData);
                $this->logActivity($user, 'edit', $description, $changedData);
            }

            return $user->fresh(['roles', 'employee']);
        });
    }

    /**
     * Delete a user (unlinks from employee first).
     */
    public function deleteUser(User $user): bool
    {
        return DB::transaction(function () use ($user) {
            // Log activity before deletion
            $this->logActivity($user, 'delete', 'User account deleted', [
                'name' => $user->name,
                'email' => $user->email,
            ]);

            // Remove role associations
            $user->syncRoles([]);

            return $user->delete();
        });
    }

    /**
     * Link an employee to a user.
     */
    public function linkEmployee(User $user, string $employeeId): User
    {
        return DB::transaction(function () use ($user, $employeeId) {
            $employee = Employee::findOrFail($employeeId);

            // Update user with employee link
            $user->update(['employee_id' => $employee->id]);

            // Sync email: User email takes precedence (User was created first)
            $this->syncEmailToEmployee($user);

            // Log activity
            $this->logActivity($user, 'link_employee', "User linked to employee {$employee->first_name} {$employee->last_name}", [
                'employee_id' => [
                    'from' => null,
                    'to' => "{$employee->first_name} {$employee->last_name} ({$employee->employee_code})",
                ],
            ]);

            return $user->fresh(['employee']);
        });
    }

    /**
     * Unlink employee from a user.
     */
    public function unlinkEmployee(User $user): User
    {
        $oldEmployeeId = $user->employee_id;
        $oldEmployee = null;

        if ($oldEmployeeId) {
            $oldEmployee = Employee::find($oldEmployeeId);
        }

        $user->update(['employee_id' => null]);

        // Log activity
        $this->logActivity($user, 'unlink_employee', 'User unlinked from employee', [
            'employee_id' => [
                'from' => $oldEmployee ? "{$oldEmployee->first_name} {$oldEmployee->last_name} ({$oldEmployee->employee_code})" : null,
                'to' => null,
            ],
        ]);

        return $user->fresh();
    }

    /**
     * Create a user account for an existing employee.
     *
     * @param  array{password?: string, role?: string, send_credentials?: bool}  $data
     */
    public function createUserForEmployee(Employee $employee, array $data = []): User
    {
        return DB::transaction(function () use ($employee, $data) {
            // Check if a user with this email already exists
            $existingUser = User::where('email', $employee->email)->first();
            if ($existingUser) {
                // If user exists but not linked to this employee, link it
                if ($existingUser->employee_id !== $employee->id) {
                    $existingUser->update(['employee_id' => $employee->id]);
                    $this->logActivity($existingUser, 'link_employee', "User linked to employee {$employee->first_name} {$employee->last_name}", [
                        'employee_id' => [
                            'from' => null,
                            'to' => "{$employee->first_name} {$employee->last_name} ({$employee->employee_code})",
                        ],
                    ]);
                }

                return $existingUser;
            }

            $plainPassword = $data['password'] ?? Str::random(config('user.password.generated_length', 12));

            $user = User::create([
                'name' => $employee->full_name,
                'email' => $employee->email,
                'password' => Hash::make($plainPassword),
                'employee_id' => $employee->id,
                'created_by' => Auth::id(),
            ]);

            // Assign role if provided
            if (! empty($data['role'])) {
                $user->assignRole($data['role']);
            }

            // Log activity
            $this->logActivity($user, 'add', 'User account created for employee', [
                'name' => $user->name,
                'email' => $user->email,
                'employee_id' => $employee->id,
                'role' => $data['role'] ?? null,
            ]);

            // Send credentials notification
            if ($data['send_credentials'] ?? true) {
                $user->notify(new UserCreatedNotification($plainPassword));
            }

            return $user;
        });
    }

    /**
     * Create an employee record for an existing user.
     *
     * @param  array{employee_code: string, first_name: string, last_name: string, department_id?: string, designation_id?: string}  $data
     */
    public function createEmployeeForUser(User $user, array $data): Employee
    {
        return DB::transaction(function () use ($user, $data) {
            // Use user's email for employee
            $data['email'] = $user->email;

            $employee = Employee::create($data);

            // Link user to employee
            $user->update(['employee_id' => $employee->id]);

            return $employee;
        });
    }

    /**
     * Sync email from user to linked employee.
     * User email takes precedence as the source of truth.
     */
    private function syncEmailToEmployee(User $user): void
    {
        if ($user->employee && $user->employee->email !== $user->email) {
            $user->employee->update(['email' => $user->email]);
        }
    }

    /**
     * Sync email from employee to linked user.
     * Used when employee is the source (Employee created first).
     */
    public function syncEmailFromEmployee(Employee $employee): void
    {
        if ($employee->user && $employee->user->email !== $employee->email) {
            $employee->user->update([
                'previous_email' => $employee->user->email,
                'email' => $employee->email,
                'email_verified_at' => null,
            ]);
        }
    }

    /**
     * Log user activity.
     */
    private function logActivity(User $user, string $action, string $description, ?array $changedData = null): void
    {
        $causerId = Auth::id();
        $causer = $causerId ? User::find($causerId) : null;

        UserActivityLog::create([
            'user_id' => $user->id,
            'action' => $action,
            'description' => $description,
            'changed_data' => $changedData,
            'causer_id' => $causerId,
            'causer_name' => $causer ? $causer->name : 'System',
        ]);
    }

    /**
     * Build a human-readable description of changes.
     */
    private function buildUpdateDescription(array $changedData): string
    {
        $changes = [];
        foreach ($changedData as $field => $change) {
            if ($field === 'password') {
                $changes[] = 'Password updated';
            } elseif (is_array($change)) {
                $fieldLabel = match ($field) {
                    'email' => 'Email',
                    'employee_id' => 'Employee',
                    'role' => 'Role',
                    default => ucfirst(str_replace('_', ' ', $field)),
                };
                $changes[] = $fieldLabel;
            }
        }

        return 'Updated: '.implode(', ', $changes);
    }

    /**
     * Update user status and sync with linked employee.
     */
    public function updateUserStatus(User $user, string $status): User
    {
        return DB::transaction(function () use ($user, $status) {
            $user->setStatus($status);

            // Sync status to linked employee
            if ($user->employee) {
                $user->employee->setStatus($status);
            }

            return $user->fresh();
        });
    }

    /**
     * Send welcome email with password reset link to user.
     */
    public function sendWelcomeEmail(User $user): void
    {
        // Generate a temporary password for the notification
        $tempPassword = '';
        $user->notify(new UserCreatedNotification($tempPassword));

        // Log the activity
        $this->logActivity($user, 'email', "Welcome email sent to {$user->email}", [
            'email' => $user->email,
            'type' => 'welcome',
        ]);
    }
}
