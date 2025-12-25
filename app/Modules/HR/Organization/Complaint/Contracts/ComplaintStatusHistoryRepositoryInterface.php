<?php

namespace App\Modules\HR\Organization\Complaint\Contracts;

use App\Modules\HR\Organization\Complaint\Models\ComplaintStatusHistory;
use Illuminate\Database\Eloquent\Collection;

interface ComplaintStatusHistoryRepositoryInterface
{
    public function create(array $data): ComplaintStatusHistory;

    public function findById(string $id): ComplaintStatusHistory;

    public function getByComplaintId(string $complaintId): Collection;
}
