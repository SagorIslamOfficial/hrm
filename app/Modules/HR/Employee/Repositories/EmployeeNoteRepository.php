<?php

namespace App\Modules\HR\Employee\Repositories;

use App\Models\User;
use App\Modules\HR\Employee\Contracts\EmployeeNoteRepositoryInterface;
use App\Modules\HR\Employee\Models\EmployeeNote;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class EmployeeNoteRepository implements EmployeeNoteRepositoryInterface
{
    public function create(array $data): EmployeeNote
    {
        return EmployeeNote::create($data);
    }

    public function findById(string $id): EmployeeNote
    {
        return EmployeeNote::with(['employee', 'creator', 'updater'])->findOrFail($id);
    }

    public function update(EmployeeNote $note, array $data): bool
    {
        return $note->update($data);
    }

    public function delete(EmployeeNote $note): bool
    {
        return $note->delete();
    }

    public function getByEmployee(string $employeeId, ?User $user = null): Collection
    {
        $query = EmployeeNote::with(['creator:id,name', 'updater:id,name'])
            ->where('employee_id', $employeeId);

        // Filter private notes based on user permissions
        if ($user && ! $user->hasPermissionTo('view-private-notes') && ! $user->hasRole(['Admin', 'HR'])) {
            $query->where(function ($q) use ($user) {
                $q->where('is_private', false)
                    ->orWhere('created_by', $user->id);
            });
        }

        return $query->latest()->get();
    }

    public function getByEmployeeWithFilters(string $employeeId, array $filters = [], int $perPage = 10, ?User $user = null): LengthAwarePaginator
    {
        $query = EmployeeNote::with(['creator', 'updater'])
            ->where('employee_id', $employeeId);

        // Filter private notes based on user permissions
        if ($user && ! $user->hasPermissionTo('view-private-notes') && ! $user->hasRole(['Admin', 'HR'])) {
            $query->where(function ($q) use ($user) {
                $q->where('is_private', false)
                    ->orWhere('created_by', $user->id);
            });
        }

        if (isset($filters['category']) && $filters['category'] !== '') {
            $query->where('category', $filters['category']);
        }

        if (isset($filters['is_private'])) {
            $query->where('is_private', $filters['is_private']);
        }

        if (isset($filters['search']) && $filters['search'] !== '') {
            $query->where('note', 'like', '%'.$filters['search'].'%');
        }

        return $query->latest()->paginate($perPage);
    }

    public function all(): Collection
    {
        return EmployeeNote::with(['employee', 'creator', 'updater'])->get();
    }
}
