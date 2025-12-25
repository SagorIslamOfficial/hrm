<?php

namespace App\Modules\HR\Organization\Complaint\Contracts;

use App\Modules\HR\Organization\Complaint\Models\ComplaintDocument;
use Illuminate\Database\Eloquent\Collection;

interface ComplaintDocumentRepositoryInterface
{
    public function create(array $data): ComplaintDocument;

    public function findById(string $id): ComplaintDocument;

    public function update(ComplaintDocument $document, array $data): bool;

    public function delete(ComplaintDocument $document): bool;

    public function getByComplaintId(string $complaintId): Collection;
}
