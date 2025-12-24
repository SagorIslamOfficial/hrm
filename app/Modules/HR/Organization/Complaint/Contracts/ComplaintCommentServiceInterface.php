<?php

namespace App\Modules\HR\Organization\Complaint\Contracts;

use App\Modules\HR\Organization\Complaint\Models\Complaint;
use App\Modules\HR\Organization\Complaint\Models\ComplaintComment;

interface ComplaintCommentServiceInterface
{
    public function createComment(Complaint $complaint, array $data): ComplaintComment;

    public function updateComment(ComplaintComment $comment, array $data): bool;

    public function deleteComment(ComplaintComment $comment): bool;

    public function ensureCommentBelongsToComplaint(Complaint $complaint, ComplaintComment $comment): void;

    public function canModifyComment(ComplaintComment $comment): bool;

    public function syncComments(Complaint $complaint, array $comments): void;
}
