<?php

namespace App\Modules\HR\Organization\Complaint\Services;

use App\Modules\HR\Organization\Complaint\Contracts\ComplaintRepositoryInterface;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintStatusHistoryRepositoryInterface;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintStatusServiceInterface;
use App\Modules\HR\Organization\Complaint\Enums\ComplaintPriority;
use App\Modules\HR\Organization\Complaint\Enums\ComplaintStatus;
use App\Modules\HR\Organization\Complaint\Models\Complaint;
use App\Modules\HR\Organization\Complaint\Notifications\ComplaintStatusUpdated;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;

class ComplaintStatusService implements ComplaintStatusServiceInterface
{
    public function __construct(
        private ComplaintRepositoryInterface $complaintRepository,
        private ComplaintStatusHistoryRepositoryInterface $statusHistoryRepository
    ) {}

    public function submitComplaint(string $id): Complaint
    {
        $complaint = $this->complaintRepository->findOrFail($id);
        $oldStatus = $complaint->status?->value ?? ComplaintStatus::DRAFT->value;
        $newStatus = ComplaintStatus::SUBMITTED->value;

        $updates = [
            'status' => $newStatus,
            'submitted_at' => now(),
        ];

        // Set SLA hours based on priority
        if (! $complaint->sla_hours) {
            $updates['sla_hours'] = $this->getSlaHoursForPriority($complaint->priority);
        }

        // Set due date if not set (based on SLA)
        if (! $complaint->due_date && isset($updates['sla_hours'])) {
            $updates['due_date'] = now()->addHours($updates['sla_hours']);
        }

        // Set SLA breach timestamp
        if (! $complaint->sla_breach_at && isset($updates['due_date'])) {
            $updates['sla_breach_at'] = $updates['due_date'];
        }

        $this->complaintRepository->update($complaint, $updates);

        $this->logStatusChange($complaint, $oldStatus, $newStatus, null);

        $this->notifyCreator($complaint->fresh(), $oldStatus);

        return $complaint->fresh();
    }

    public function updateComplaintStatus(string $id, string $newStatus, ?string $notes = null): Complaint
    {
        $complaint = $this->complaintRepository->findOrFail($id);
        $oldStatus = $complaint->status?->value;

        $updates = ['status' => $newStatus];

        // Update timestamps based on status
        match ($newStatus) {
            'acknowledged' => $updates['acknowledged_at'] = $updates['acknowledged_at'] ?? now(),
            'resolved' => $updates['resolved_at'] = now(),
            'closed' => $updates['closed_at'] = now(),
            default => null,
        };

        $complaint->update($updates);

        $this->logStatusChange($complaint, $oldStatus, $newStatus, $notes);

        $this->notifyCreator($complaint->fresh(), $oldStatus);

        return $complaint->fresh();
    }

    private function notifyCreator(Complaint $complaint, ?string $previousStatus): void
    {
        $employee = $complaint->employee;

        if (! $employee) {
            return;
        }

        // Try to notify via User account first
        if ($employee->user) {
            $employee->user->notify(new ComplaintStatusUpdated(
                $complaint,
                $previousStatus ?? 'Unknown',
                $employee->user->name
            ));

            return;
        }

        // Fallback to Employee email if no User account
        if ($employee->email) {
            Notification::route('mail', $employee->email)
                ->notify(new ComplaintStatusUpdated(
                    $complaint,
                    $previousStatus ?? 'Unknown',
                    $employee->first_name.' '.$employee->last_name
                ));
        }
    }

    private function logStatusChange(Complaint $complaint, ?string $from, string $to, ?string $notes): void
    {
        $this->statusHistoryRepository->create([
            'complaint_id' => $complaint->id,
            'from_status' => $from,
            'to_status' => $to,
            'notes' => $notes,
            'changed_by' => Auth::id(),
        ]);
    }

    private function getSlaHoursForPriority(ComplaintPriority $priority): int
    {
        return match ($priority->value) {
            'critical' => 72,   // 3 days
            'urgent' => 120,    // 5 days
            'high' => 168,      // 7 days
            'medium' => 360,    // 15 days
            'low' => 720,       // 30 days
            default => 360,     // default to medium
        };
    }
}
