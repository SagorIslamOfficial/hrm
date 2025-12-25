<?php

namespace App\Modules\HR\Organization\Complaint\Contracts;

use App\Modules\HR\Organization\Complaint\Models\ComplaintComment;
use Illuminate\Database\Eloquent\Collection;

interface ComplaintCommentRepositoryInterface
{
    public function create(array $data): ComplaintComment;

    public function findById(string $id): ComplaintComment;

    public function update(ComplaintComment $comment, array $data): bool;

    public function delete(ComplaintComment $comment): bool;

    public function getByComplaintId(string $complaintId): Collection;
}
