<?php

namespace App\Modules\HR\Organization\Complaint\Contracts;

use App\Modules\HR\Organization\Complaint\Models\Complaint;

interface ComplaintResolutionServiceInterface
{
    public function storeResolution(Complaint $complaint, array $data): Complaint;

    public function updateResolution(Complaint $complaint, array $data): Complaint;

    public function recordFeedback(Complaint $complaint, array $data): Complaint;
}
