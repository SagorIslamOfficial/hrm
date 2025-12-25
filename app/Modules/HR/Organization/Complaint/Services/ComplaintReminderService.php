<?php

namespace App\Modules\HR\Organization\Complaint\Services;

use App\Modules\HR\Organization\Complaint\Contracts\ComplaintReminderRepositoryInterface;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintReminderServiceInterface;
use App\Modules\HR\Organization\Complaint\Jobs\ProcessComplaintReminder;
use App\Modules\HR\Organization\Complaint\Models\Complaint;
use App\Modules\HR\Organization\Complaint\Models\ComplaintReminder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;

class ComplaintReminderService implements ComplaintReminderServiceInterface
{
    public function __construct(
        private ComplaintReminderRepositoryInterface $reminderRepository
    ) {}

    // Create a new reminder for a complaint.
    public function createReminder(Complaint $complaint, array $data): ComplaintReminder
    {
        $data['complaint_id'] = $complaint->id;
        $reminder = $this->reminderRepository->create($data);

        ProcessComplaintReminder::dispatch($reminder->id)->delay($reminder->remind_at);

        return $reminder;
    }

    // Update an existing reminder.
    public function updateReminder(ComplaintReminder $reminder, array $data): bool
    {
        $updated = $this->reminderRepository->update($reminder, $data);

        if ($updated) {
            ProcessComplaintReminder::dispatch($reminder->id)->delay($reminder->remind_at);
        }

        return $updated;
    }

    // Delete a reminder.
    public function deleteReminder(ComplaintReminder $reminder): bool
    {
        return $this->reminderRepository->delete($reminder);
    }

    // Mark reminder as sent.
    public function markAsSent(ComplaintReminder $reminder): ComplaintReminder
    {
        $reminder->markAsSent();

        return $reminder;
    }

    // Get pending reminders (for UI).
    public function getPendingReminders(): Collection
    {
        if (! Auth::user()->hasAnyRole(['Admin', 'HR'])) {
            abort(403);
        }

        return $this->reminderRepository->getPendingReminders();
    }

    // Ensure reminder belongs to complaint.
    public function ensureReminderBelongsToComplaint(Complaint $complaint, ComplaintReminder $reminder): void
    {
        if ($reminder->complaint_id !== $complaint->id) {
            abort(404, 'Reminder not found for this complaint.');
        }
    }
}
