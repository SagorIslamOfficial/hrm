<?php

namespace App\Modules\HR\Employee\Services;

use App\Modules\HR\Employee\Contracts\EmployeeCustomFieldRepositoryInterface;
use App\Modules\HR\Employee\Contracts\EmployeeCustomFieldServiceInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EmployeeCustomFieldService implements EmployeeCustomFieldServiceInterface
{
    public function __construct(
        protected EmployeeCustomFieldRepositoryInterface $repository
    ) {}

    public function create(array $data): mixed
    {
        try {
            return DB::transaction(function () use ($data) {
                return $this->repository->create($data);
            });
        } catch (\Exception $e) {
            Log::error('Employee custom field creation failed: '.$e->getMessage());
            throw $e;
        }
    }

    public function update(string $id, array $data): bool
    {
        try {
            return DB::transaction(function () use ($id, $data) {
                return $this->repository->update($id, $data);
            });
        } catch (\Exception $e) {
            Log::error('Employee custom field update failed: '.$e->getMessage());
            throw $e;
        }
    }

    public function delete(string $id): bool
    {
        try {
            return DB::transaction(function () use ($id) {
                return $this->repository->delete($id);
            });
        } catch (\Exception $e) {
            Log::error('Employee custom field deletion failed: '.$e->getMessage());
            throw $e;
        }
    }

    public function syncCustomFields(string $employeeId, array $fields): void
    {
        try {
            DB::transaction(function () use ($employeeId, $fields) {
                $this->repository->syncCustomFields($employeeId, $fields);
            });
        } catch (\Exception $e) {
            Log::error('Employee custom fields sync failed: '.$e->getMessage());
            throw $e;
        }
    }
}
