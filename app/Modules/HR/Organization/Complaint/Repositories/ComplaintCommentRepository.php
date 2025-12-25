<?php

namespace App\Modules\HR\Organization\Complaint\Repositories;

use App\Modules\HR\Organization\Complaint\Contracts\ComplaintCommentRepositoryInterface;
use App\Modules\HR\Organization\Complaint\Models\ComplaintComment;
use Illuminate\Database\Eloquent\Collection;

class ComplaintCommentRepository implements ComplaintCommentRepositoryInterface
{
    public function create(array $data): ComplaintComment
    {
        return ComplaintComment::create($data);
    }

    public function findById(string $id): ComplaintComment
    {
        return ComplaintComment::findOrFail($id);
    }

    public function update(ComplaintComment $comment, array $data): bool
    {
        return $comment->update($data);
    }

    public function delete(ComplaintComment $comment): bool
    {
        return $comment->delete();
    }

    public function getByComplaintId(string $complaintId): Collection
    {
        return ComplaintComment::where('complaint_id', $complaintId)
            ->with('creator:id,name')
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
