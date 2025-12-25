<?php

namespace App\Modules\HR\Organization\Complaint\Repositories;

use App\Modules\HR\Organization\Complaint\Contracts\ComplaintSubjectRepositoryInterface;
use App\Modules\HR\Organization\Complaint\Models\ComplaintSubject;
use Illuminate\Database\Eloquent\Collection;

class ComplaintSubjectRepository implements ComplaintSubjectRepositoryInterface
{
    public function create(array $data): ComplaintSubject
    {
        return ComplaintSubject::create($data);
    }

    public function findById(string $id): ComplaintSubject
    {
        return ComplaintSubject::findOrFail($id);
    }

    public function update(ComplaintSubject $subject, array $data): bool
    {
        return $subject->update($data);
    }

    public function delete(ComplaintSubject $subject): bool
    {
        return $subject->delete();
    }

    public function getByComplaintId(string $complaintId): Collection
    {
        return ComplaintSubject::where('complaint_id', $complaintId)
            ->with('subject')
            ->orderBy('is_primary', 'desc')
            ->orderBy('created_at', 'asc')
            ->get();
    }
}
