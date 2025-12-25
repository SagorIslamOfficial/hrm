<?php

namespace App\Modules\HR\Organization\Complaint\Services;

use App\Modules\HR\Organization\Complaint\Contracts\ComplaintCommentServiceInterface;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintDocumentServiceInterface;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintRepositoryInterface;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintServiceInterface;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintSubjectServiceInterface;
use App\Modules\HR\Organization\Complaint\Models\Complaint;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ComplaintService implements ComplaintServiceInterface
{
    public function __construct(
        private ComplaintRepositoryInterface $complaintRepository,
        private ComplaintSubjectServiceInterface $subjectService,
        private ComplaintCommentServiceInterface $commentService,
        private ComplaintDocumentServiceInterface $documentService
    ) {}

    public function getComplaintsPaginated(int $perPage = 10): LengthAwarePaginator
    {
        return $this->complaintRepository->paginate($perPage);
    }

    public function createComplaint(array $data): Complaint
    {
        // Generate complaint number
        $data['complaint_number'] = $this->generateComplaintNumber();

        // Set employee_id from authenticated user's employee relationship
        if (! isset($data['employee_id']) || empty($data['employee_id'])) {
            $data['employee_id'] = Auth::user()?->employee?->id;
        }

        // Set default priority
        if (! isset($data['priority'])) {
            $data['priority'] = 'medium';
        }

        DB::beginTransaction();
        try {
            $complaint = $this->complaintRepository->create($data);

            // Create initial status record
            $complaint->statusHistory()->create([
                'from_status' => null,
                'to_status' => $data['status'] ?? 'draft',
                'notes' => 'Complaint created',
                'changed_by' => Auth::id(),
            ]);

            DB::commit();

            return $complaint->fresh();
        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    public function updateComplaint(string $id, array $data): Complaint
    {
        $complaint = $this->complaintRepository->findOrFail($id);

        $subjects = $data['subjects'] ?? null;
        $comments = $data['comments'] ?? null;
        $documents = $data['documents'] ?? null;

        unset($data['subjects']);
        unset($data['comments']);
        unset($data['documents']);

        $this->complaintRepository->update($complaint, $data);

        // Delegate subject sync to subject service
        if (is_array($subjects)) {
            $this->subjectService->syncSubjects($complaint, $subjects);
        }

        // Delegate comment sync to comment service
        if (is_array($comments)) {
            $this->commentService->syncComments($complaint, $comments);
        }

        // Delegate document sync to document service
        if (is_array($documents)) {
            $this->documentService->syncDocuments($complaint, $documents);
        }

        return $complaint->fresh(['subjects', 'statusHistory']);
    }

    public function deleteComplaint(string $id): void
    {
        $complaint = $this->complaintRepository->findOrFail($id);
        $this->complaintRepository->delete($complaint);
    }

    public function restoreComplaint(string $id): void
    {
        $complaint = Complaint::withTrashed()->findOrFail($id);
        $this->complaintRepository->restore($complaint);
    }

    public function forceDeleteComplaint(string $id): void
    {
        $complaint = Complaint::withTrashed()->findOrFail($id);
        $this->complaintRepository->forceDelete($complaint);
    }

    private function generateComplaintNumber(): string
    {
        $year = date('Y');
        $prefix = "CPL-{$year}-";

        $lastNumber = Complaint::withTrashed()
            ->where('complaint_number', 'like', "{$prefix}%")
            ->selectRaw('MAX(CAST(SUBSTRING(complaint_number, -5) AS UNSIGNED)) as max_num')
            ->value('max_num');

        $nextNumber = ($lastNumber ?? 0) + 1;

        return sprintf('%s%05d', $prefix, $nextNumber);
    }
}
