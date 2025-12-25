<?php

namespace App\Modules\HR\Organization\Complaint\Contracts;

use App\Modules\HR\Organization\Complaint\Models\ComplaintEscalation;
use Illuminate\Database\Eloquent\Collection;

interface ComplaintEscalationRepositoryInterface
{
    public function create(array $data): ComplaintEscalation;

    public function findById(string $id): ComplaintEscalation;

    public function update(ComplaintEscalation $escalation, array $data): bool;

    public function delete(ComplaintEscalation $escalation): bool;

    public function getByComplaintId(string $complaintId): Collection;
}
