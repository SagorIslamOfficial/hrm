<?php

namespace App\Modules\HR\Organization\Complaint\Contracts;

use App\Modules\HR\Organization\Complaint\Models\Complaint;
use Illuminate\Pagination\LengthAwarePaginator;

interface ComplaintServiceInterface
{
    public function getComplaintsPaginated(int $perPage = 10): LengthAwarePaginator;

    public function createComplaint(array $data): Complaint;

    public function updateComplaint(string $id, array $data): Complaint;

    public function deleteComplaint(string $id): void;

    public function restoreComplaint(string $id): void;

    public function forceDeleteComplaint(string $id): void;
}

