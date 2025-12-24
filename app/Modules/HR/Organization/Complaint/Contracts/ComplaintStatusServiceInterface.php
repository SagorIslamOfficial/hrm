<?php

namespace App\Modules\HR\Organization\Complaint\Contracts;

use App\Modules\HR\Organization\Complaint\Models\Complaint;

interface ComplaintStatusServiceInterface
{
    public function submitComplaint(string $id): Complaint;

    public function updateComplaintStatus(string $id, string $newStatus, ?string $notes = null): Complaint;
}
