<?php

namespace App\Modules\Department\Contracts;

use App\Modules\Department\Models\Designation;
use Illuminate\Database\Eloquent\Collection;

interface DesignationServiceInterface
{
    public function createDesignation(array $data): Designation;

    public function updateDesignation(string $id, array $data): Designation;

    public function deleteDesignation(string $id): void;

    public function restoreDesignation(string $id): void;

    public function forceDeleteDesignation(string $id): void;

    public function getDesignationStats(string $id): array;

    public function getDesignationsByDepartment(string $departmentId): Collection;

    public function getActiveDesignations(): Collection;
}
