<?php

namespace App\Modules\Employee\Services;

use App\Modules\Employee\Contracts\EmployeeNoteRepositoryInterface;
use App\Modules\Employee\Contracts\EmployeeNoteServiceInterface;
use App\Modules\Employee\Models\EmployeeNote;

class EmployeeNoteService implements EmployeeNoteServiceInterface
{
    public function __construct(
        private EmployeeNoteRepositoryInterface $noteRepository
    ) {}

    public function createNote(array $data): EmployeeNote
    {
        return $this->noteRepository->create($data);
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
