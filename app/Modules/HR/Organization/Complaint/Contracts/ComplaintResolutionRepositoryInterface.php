<?php

namespace App\Modules\HR\Organization\Complaint\Contracts;

use App\Modules\HR\Organization\Complaint\Models\ComplaintResolution;

interface ComplaintResolutionRepositoryInterface
{
    public function create(array $data): ComplaintResolution;

    public function findById(string $id): ComplaintResolution;

    public function update(ComplaintResolution $resolution, array $data): bool;

    public function delete(ComplaintResolution $resolution): bool;

    public function getByComplaintId(string $complaintId): ?ComplaintResolution;
}
