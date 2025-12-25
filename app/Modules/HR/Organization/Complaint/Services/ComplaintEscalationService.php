<?php

namespace App\Modules\HR\Organization\Complaint\Services;

use App\Modules\HR\Organization\Complaint\Contracts\ComplaintEscalationRepositoryInterface;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintEscalationServiceInterface;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintStatusHistoryRepositoryInterface;
use App\Modules\HR\Organization\Complaint\Models\Complaint;
use App\Modules\HR\Organization\Complaint\Notifications\ComplaintStatusUpdated;
use Illuminate\Support\Facades\Auth;

class ComplaintEscalationService implements ComplaintEscalationServiceInterface
{
    public function __construct(
        private ComplaintEscalationRepositoryInterface $escalationRepository,
        private ComplaintStatusHistoryRepositoryInterface $statusHistoryRepository
    ) {}

    // Store a new escalation.
    public function storeEscalation(Complaint $complaint, array $data): Complaint
    {
        $currentAssignee = $complaint->assigned_to;
        $escalationLevel = $this->determineEscalationLevel($complaint);
        $previousStatus = $complaint->status;

        $escalatedTo = $data['escalated_to'];
        $primaryAssignee = is_array($escalatedTo) ? ($escalatedTo[0] ?? null) : $escalatedTo;

        $this->escalationRepository->create([
            'complaint_id' => $complaint->id,
            'escalated_from' => $currentAssignee,
            'escalated_to' => $escalatedTo,
            'escalation_level' => $escalationLevel,
            'reason' => $data['reason'],
            'escalated_at' => now(),
            'escalated_by' => Auth::id(),
        ]);

        $complaint->update([
            'is_escalated' => true,
            'escalated_at' => now(),
            'escalated_to' => $escalatedTo,
            'assigned_to' => $primaryAssignee,
            'status' => 'escalated',
        ]);

        $this->statusHistoryRepository->create([
            'complaint_id' => $complaint->id,
            'from_status' => $previousStatus?->value,
            'to_status' => 'escalated',
            'notes' => 'Escalated: '.$data['reason'],
            'changed_by' => Auth::id(),
        ]);

        $this->notifyCreator($complaint->fresh(), $previousStatus?->value ?? 'unknown');

        return $complaint->fresh();
    }

    // De-escalate a complaint.
    public function deescalate(Complaint $complaint, array $data): Complaint
    {
        if (! $complaint->is_escalated) {
            abort(400, 'Complaint is not escalated.');
        }

        $complaint->update([
            'is_escalated' => false,
            'escalated_to' => null,
            'assigned_to' => $data['assigned_to'],
            'status' => 'under_review',
        ]);

        $this->statusHistoryRepository->create([
            'complaint_id' => $complaint->id,
            'from_status' => 'escalated',
            'to_status' => 'under_review',
            'notes' => 'De-escalated: '.($data['reason'] ?? 'Returned to normal processing'),
            'changed_by' => Auth::id(),
        ]);

        $this->notifyCreator($complaint->fresh(), 'escalated');

        return $complaint->fresh();
    }

    private function notifyCreator(Complaint $complaint, string $previousStatus): void
    {
        $user = $complaint->employee?->user;
        if ($user) {
            $user->notify(new ComplaintStatusUpdated($complaint, $previousStatus));
        }
    }

    // Determine the escalation level based on previous escalations.
    protected function determineEscalationLevel(Complaint $complaint): string
    {
        $escalationCount = $this->escalationRepository->getByComplaintId($complaint->id)->count();

        return 'level_'.($escalationCount + 1);
    }
}
