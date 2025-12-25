<?php

namespace App\Modules\HR\Organization\Complaint\Services;

use App\Modules\HR\Organization\Complaint\Contracts\ComplaintCommentRepositoryInterface;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintCommentServiceInterface;
use App\Modules\HR\Organization\Complaint\Models\Complaint;
use App\Modules\HR\Organization\Complaint\Models\ComplaintComment;
use Illuminate\Support\Facades\Auth;

class ComplaintCommentService implements ComplaintCommentServiceInterface
{
    public function __construct(
        private ComplaintCommentRepositoryInterface $commentRepository
    ) {}

    // Create a new comment for a complaint.
    public function createComment(Complaint $complaint, array $data): ComplaintComment
    {
        $data['complaint_id'] = $complaint->id;
        $data['created_by'] = Auth::id();

        return $this->commentRepository->create($data);
    }

    // Sync comments (create new, update modified, delete removed).
    public function syncComments(Complaint $complaint, array $comments): void
    {
        foreach ($comments as $commentData) {
            // Handle deletions
            if (isset($commentData['_isDeleted']) && $commentData['_isDeleted']) {
                if (isset($commentData['id']) && ! str_starts_with($commentData['id'], 'temp-')) {
                    $comment = $this->commentRepository->findById($commentData['id']);
                    if ($comment) {
                        $this->commentRepository->delete($comment);
                    }
                }

                continue;
            }

            // Handle new comments
            if (isset($commentData['_isNew']) && $commentData['_isNew']) {
                $this->createComment($complaint, $commentData);

                continue;
            }

            // Handle modified existing comments
            if (isset($commentData['_isModified']) && $commentData['_isModified'] && isset($commentData['id'])) {
                if (str_starts_with($commentData['id'], 'temp-')) {
                    continue;
                }

                $comment = $this->commentRepository->findById($commentData['id']);
                if ($comment) {
                    $this->commentRepository->update($comment, $commentData);
                }
            }
        }
    }
}
