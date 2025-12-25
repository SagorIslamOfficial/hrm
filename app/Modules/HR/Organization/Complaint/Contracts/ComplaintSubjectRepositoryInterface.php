<?php

namespace App\Modules\HR\Organization\Complaint\Contracts;

use App\Modules\HR\Organization\Complaint\Models\ComplaintSubject;
use Illuminate\Database\Eloquent\Collection;

interface ComplaintSubjectRepositoryInterface
{
    public function create(array $data): ComplaintSubject;

    public function findById(string $id): ComplaintSubject;

    public function update(ComplaintSubject $subject, array $data): bool;

    public function delete(ComplaintSubject $subject): bool;

    public function getByComplaintId(string $complaintId): Collection;
}
