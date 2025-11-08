<?php

namespace App\Modules\HR\Employee\Services;

use App\Modules\HR\Employee\Contracts\EmployeeNoteRepositoryInterface;
use App\Modules\HR\Employee\Contracts\EmployeeNoteServiceInterface;
use App\Modules\HR\Employee\Models\EmployeeNote;

class EmployeeNoteService implements EmployeeNoteServiceInterface
{
    public function __construct(
        private EmployeeNoteRepositoryInterface $noteRepository
    ) {}

    public function createNote(array $data): EmployeeNote
    {
        $note = $this->noteRepository->create($data);

        return $note->fresh();
    }

    public function updateNote(string $id, array $data): EmployeeNote
    {
        $note = $this->noteRepository->findById($id);
        $this->noteRepository->update($note, $data);

        return $note->fresh();
    }

    public function deleteNote(string $id): void
    {
        $note = $this->noteRepository->findById($id);
        $this->noteRepository->delete($note);
    }
}
