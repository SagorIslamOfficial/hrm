<?php

namespace App\Modules\HR\Organization\Complaint\Contracts;

use App\Modules\HR\Organization\Complaint\Models\Complaint;
use App\Modules\HR\Organization\Complaint\Models\ComplaintSubject;

interface ComplaintSubjectServiceInterface
{
    public function syncSubjects(Complaint $complaint, array $subjects): void;

    public function createSubject(Complaint $complaint, array $data): ComplaintSubject;

    public function updateSubject(Complaint $complaint, string $subjectId, array $data): bool;

    public function deleteSubject(ComplaintSubject $subject): bool;
}
