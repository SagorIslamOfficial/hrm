<?php

namespace App\Modules\HR\Organization\Complaint\Services;

use App\Modules\HR\Organization\Complaint\Contracts\ComplaintCommentServiceInterface;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintDocumentServiceInterface;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintRepositoryInterface;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintServiceInterface;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintSubjectServiceInterface;
use App\Modules\HR\Organization\Complaint\Enums\ComplaintPriority;
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
            $data['priority'] = ComplaintPriority::MEDIUM->value;
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

    public function submitComplaint(string $id): Complaint
    {
        $complaint = $this->complaintRepository->findOrFail($id);

        DB::beginTransaction();
        try {
            $data = [
                'status' => 'submitted',
                'submitted_at' => now(),
            ];

            // Calculate due date based on SLA hours
            if ($complaint->sla_hours) {
                $data['due_date'] = now()->addHours($complaint->sla_hours);
            }

            $this->complaintRepository->update($complaint, $data);

            // Create status history
            $complaint->statusHistory()->create([
                'from_status' => 'draft',
                'to_status' => 'submitted',
                'notes' => 'Complaint submitted',
                'changed_by' => Auth::id(),
            ]);

            DB::commit();

            return $complaint->fresh();
        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    public function updateComplaintStatus(string $id, string $status, ?string $notes = null): Complaint
    {
        $complaint = $this->complaintRepository->findOrFail($id);

        DB::beginTransaction();
        try {
            $oldStatus = $complaint->status->value;

            $this->complaintRepository->update($complaint, ['status' => $status]);

            // Create status history
            $complaint->statusHistory()->create([
                'from_status' => $oldStatus,
                'to_status' => $status,
                'notes' => $notes,
                'changed_by' => Auth::id(),
            ]);

            DB::commit();

            return $complaint->fresh(['statusHistory']);
        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    public function escalateComplaint(string $id, string $escalateToUserId, ?string $reason = null): Complaint
    {
        $complaint = $this->complaintRepository->findOrFail($id);

        DB::beginTransaction();
        try {
            $escalatedToList = $complaint->escalated_to ?? [];
            if (! is_array($escalatedToList)) {
                $escalatedToList = [];
            }
            $escalatedToList[] = $escalateToUserId;

            $data = [
                'is_escalated' => true,
                'escalated_at' => now(),
                'escalated_to' => $escalatedToList,
                'status' => 'escalated',
            ];

            $this->complaintRepository->update($complaint, $data);

            // Create escalation record
            $complaint->escalations()->create([
                'escalated_by' => Auth::id(),
                'escalated_to' => $escalateToUserId,
                'reason' => $reason,
                'escalation_level' => 1,
                'escalated_at' => now(),
            ]);

            // Create status history
            $complaint->statusHistory()->create([
                'from_status' => $complaint->getOriginal('status'),
                'to_status' => 'escalated',
                'notes' => $reason ?? 'Complaint escalated',
                'changed_by' => Auth::id(),
            ]);

            DB::commit();

            return $complaint->fresh();
        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
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
