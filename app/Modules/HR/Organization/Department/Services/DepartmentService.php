<?php

namespace App\Modules\HR\Organization\Department\Services;

use App\Modules\HR\Organization\Department\Contracts\DepartmentRepositoryInterface;
use App\Modules\HR\Organization\Department\Contracts\DepartmentServiceInterface;
use App\Modules\HR\Organization\Department\Models\Department;
use Illuminate\Support\Facades\Auth;

class DepartmentService implements DepartmentServiceInterface
{
    public function __construct(
        private DepartmentRepositoryInterface $departmentRepository
    ) {}

    public function createDepartment(array $data): Department
    {
        return $this->departmentRepository->create($data);
    }

    public function updateDepartment(string $id, array $data): Department
    {
        $department = $this->departmentRepository->findById($id);

        // Extract nested data
        $detailData = array_key_exists('detail', $data) ? $data['detail'] : null;
        $settingsData = array_key_exists('settings', $data) ? $data['settings'] : null;
        $notesData = array_key_exists('notes', $data) ? $data['notes'] : null;

        // Remove nested data from main update
        unset($data['detail'], $data['settings'], $data['notes']);

        // Update main department
        $this->departmentRepository->update($department, $data);

        // Update or create detail
        if ($detailData !== null) {
            $department->detail()->updateOrCreate(
                ['department_id' => $department->id],
                $detailData
            );
        }

        // Update or create settings
        if ($settingsData !== null) {
            $department->settings()->updateOrCreate(
                ['department_id' => $department->id],
                $settingsData
            );
        }

        // Handle notes
        if ($notesData !== null) {
            $this->syncNotes($department, $notesData);
        }

        return $department->fresh(['detail', 'settings', 'notes']);
    }

    private function syncNotes(Department $department, array $notesData): void
    {
        $existingNotes = $department->notes()->get()->keyBy('id');
        $incomingNoteIds = [];
        $currentUserId = Auth::id();

        foreach ($notesData as $noteData) {
            $incomingNoteIds[] = $noteData['id'];

            // Skip flagged deletions
            if (isset($noteData['_isDeleted']) && $noteData['_isDeleted']) {
                continue;
            }

            // Unset internal flags
            unset($noteData['_isNew'], $noteData['_isModified'], $noteData['_isDeleted']);

            if (isset($existingNotes[$noteData['id']])) {
                // Update existing note with updated_by
                $existingNotes[$noteData['id']]->update([
                    ...$noteData,
                    'updated_by' => $currentUserId,
                ]);
            } else {
                // Create new note with created_by and updated_by
                $department->notes()->create([
                    ...$noteData,
                    'created_by' => $currentUserId,
                    'updated_by' => $currentUserId,
                ]);
            }
        }

        // Delete notes marked for deletion
        foreach ($notesData as $noteData) {
            if (isset($noteData['_isDeleted']) && $noteData['_isDeleted']) {
                $department->notes()->where('id', $noteData['id'])->delete();
            }
        }
    }

    public function deleteDepartment(string $id): void
    {
        $department = $this->departmentRepository->findById($id);
        $this->departmentRepository->delete($department);
    }

    public function restoreDepartment(string $id): void
    {
        // Load the trashed model explicitly and restore
        $department = Department::withTrashed()->findOrFail($id);
        $this->departmentRepository->restore($department);
    }

    public function forceDeleteDepartment(string $id): void
    {
        $department = Department::withTrashed()->findOrFail($id);
        $this->departmentRepository->forceDelete($department);
    }

    public function getDepartmentStats(string $id): array
    {
        $department = $this->departmentRepository->findById($id);

        return [
            'id' => $department->id,
            'name' => $department->name,
            'employee_count' => $department->employee_count,
            'budget' => $department->budget ?? 0.00,
            'manager' => $department->manager?->full_name ?? null,
        ];
    }
}
