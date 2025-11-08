<?php

namespace App\Modules\HR\Employee\Contracts;

use App\Modules\HR\Employee\Models\EmployeeNote;

interface EmployeeNoteServiceInterface
{
    public function createNote(array $data): EmployeeNote;

    public function updateNote(string $id, array $data): EmployeeNote;

    public function deleteNote(string $id): void;
}
