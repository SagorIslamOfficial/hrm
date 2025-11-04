<?php

namespace App\Modules\Department\Services;

use App\Modules\Department\Contracts\DesignationRepositoryInterface;
use App\Modules\Department\Contracts\DesignationServiceInterface;
use App\Modules\Department\Models\Designation;
use Illuminate\Database\Eloquent\Collection;

class DesignationService implements DesignationServiceInterface
{
    public function __construct(
        private DesignationRepositoryInterface $designationRepository
    ) {}

    public function createDesignation(array $data): Designation
    {
        return $this->designationRepository->create($data);
    }

    public function updateDesignation(string $id, array $data): Designation
    {
        $designation = $this->designationRepository->findById($id);
        $this->designationRepository->update($designation, $data);

        return $designation->fresh('department');
    }

    public function deleteDesignation(string $id): void
    {
        $designation = $this->designationRepository->findById($id);
        $this->designationRepository->delete($designation);
    }

    public function restoreDesignation(string $id): void
    {
        $designation = Designation::withTrashed()->findOrFail($id);
        $this->designationRepository->restore($designation);
    }

    public function forceDeleteDesignation(string $id): void
    {
        $designation = Designation::withTrashed()->findOrFail($id);
        $this->designationRepository->forceDelete($designation);
    }

    public function getDesignationStats(string $id): array
    {
        $designation = $this->designationRepository->findById($id);

        return [
            'id' => $designation->id,
            'title' => $designation->title,
            'code' => $designation->code,
            'employee_count' => $designation->employees()->count(),
            'department' => $designation->department?->name ?? null,
            'is_active' => $designation->is_active,
        ];
    }

    public function getDesignationsByDepartment(string $departmentId): Collection
    {
        return $this->designationRepository->findByDepartment($departmentId);
    }

    public function getActiveDesignations(): Collection
    {
        return $this->designationRepository->getActive();
    }
}
