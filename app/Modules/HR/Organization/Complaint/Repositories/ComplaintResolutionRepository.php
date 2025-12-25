<?php

namespace App\Modules\HR\Organization\Complaint\Repositories;

use App\Modules\HR\Organization\Complaint\Contracts\ComplaintResolutionRepositoryInterface;
use App\Modules\HR\Organization\Complaint\Models\ComplaintResolution;

class ComplaintResolutionRepository implements ComplaintResolutionRepositoryInterface
{
    public function create(array $data): ComplaintResolution
    {
        return ComplaintResolution::create($data);
    }

    public function findById(string $id): ComplaintResolution
    {
        return ComplaintResolution::findOrFail($id);
    }

    public function update(ComplaintResolution $resolution, array $data): bool
    {
        return $resolution->update($data);
    }

    public function delete(ComplaintResolution $resolution): bool
    {
        return $resolution->delete();
    }

    public function getByComplaintId(string $complaintId): ?ComplaintResolution
    {
        return ComplaintResolution::where('complaint_id', $complaintId)->first();
    }
}
