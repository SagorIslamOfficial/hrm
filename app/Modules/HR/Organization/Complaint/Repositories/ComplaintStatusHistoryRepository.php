<?php

namespace App\Modules\HR\Organization\Complaint\Repositories;

use App\Modules\HR\Organization\Complaint\Contracts\ComplaintStatusHistoryRepositoryInterface;
use App\Modules\HR\Organization\Complaint\Models\ComplaintStatusHistory;
use Illuminate\Database\Eloquent\Collection;

class ComplaintStatusHistoryRepository implements ComplaintStatusHistoryRepositoryInterface
{
    public function create(array $data): ComplaintStatusHistory
    {
        return ComplaintStatusHistory::create($data);
    }

    public function findById(string $id): ComplaintStatusHistory
    {
        return ComplaintStatusHistory::findOrFail($id);
    }

    public function getByComplaintId(string $complaintId): Collection
    {
        return ComplaintStatusHistory::where('complaint_id', $complaintId)
            ->with('changedBy:id,name')
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
