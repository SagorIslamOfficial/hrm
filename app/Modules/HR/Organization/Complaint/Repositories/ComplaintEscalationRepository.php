<?php

namespace App\Modules\HR\Organization\Complaint\Repositories;

use App\Modules\HR\Organization\Complaint\Contracts\ComplaintEscalationRepositoryInterface;
use App\Modules\HR\Organization\Complaint\Models\ComplaintEscalation;
use Illuminate\Database\Eloquent\Collection;

class ComplaintEscalationRepository implements ComplaintEscalationRepositoryInterface
{
    public function create(array $data): ComplaintEscalation
    {
        return ComplaintEscalation::create($data);
    }

    public function findById(string $id): ComplaintEscalation
    {
        return ComplaintEscalation::findOrFail($id);
    }

    public function update(ComplaintEscalation $escalation, array $data): bool
    {
        return $escalation->update($data);
    }

    public function delete(ComplaintEscalation $escalation): bool
    {
        return $escalation->delete();
    }

    public function getByComplaintId(string $complaintId): Collection
    {
        return ComplaintEscalation::where('complaint_id', $complaintId)
            ->with(['escalatedFrom:id,name', 'escalatedTo:id,name', 'escalatedBy:id,name'])
            ->orderBy('escalated_at', 'desc')
            ->get();
    }
}
