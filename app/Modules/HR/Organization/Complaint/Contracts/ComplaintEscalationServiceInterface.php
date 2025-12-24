<?php

namespace App\Modules\HR\Organization\Complaint\Contracts;

use App\Modules\HR\Organization\Complaint\Models\Complaint;

interface ComplaintEscalationServiceInterface
{
    public function storeEscalation(Complaint $complaint, array $data): Complaint;

    public function deescalate(Complaint $complaint, array $data): Complaint;
}
