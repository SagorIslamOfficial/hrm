<?php

namespace App\Modules\HR\Organization\Complaint\Repositories;

use App\Modules\HR\Organization\Complaint\Contracts\ComplaintDocumentRepositoryInterface;
use App\Modules\HR\Organization\Complaint\Models\ComplaintDocument;
use Illuminate\Database\Eloquent\Collection;

class ComplaintDocumentRepository implements ComplaintDocumentRepositoryInterface
{
    public function create(array $data): ComplaintDocument
    {
        return ComplaintDocument::create($data);
    }

    public function findById(string $id): ComplaintDocument
    {
        return ComplaintDocument::findOrFail($id);
    }

    public function update(ComplaintDocument $document, array $data): bool
    {
        return $document->update($data);
    }

    public function delete(ComplaintDocument $document): bool
    {
        return $document->delete();
    }

    public function getByComplaintId(string $complaintId): Collection
    {
        return ComplaintDocument::where('complaint_id', $complaintId)
            ->with('uploader:id,name')
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
