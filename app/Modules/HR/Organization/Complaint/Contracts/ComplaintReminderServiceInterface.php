<?php

namespace App\Modules\HR\Organization\Complaint\Contracts;

use App\Modules\HR\Organization\Complaint\Models\Complaint;
use App\Modules\HR\Organization\Complaint\Models\ComplaintReminder;
use Illuminate\Database\Eloquent\Collection;

interface ComplaintReminderServiceInterface
{
    public function createReminder(Complaint $complaint, array $data): ComplaintReminder;

    public function updateReminder(ComplaintReminder $reminder, array $data): bool;

    public function deleteReminder(ComplaintReminder $reminder): bool;

    public function markAsSent(ComplaintReminder $reminder): ComplaintReminder;

    public function getPendingReminders(): Collection;

    public function ensureReminderBelongsToComplaint(Complaint $complaint, ComplaintReminder $reminder): void;
}
