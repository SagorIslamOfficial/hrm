<?php

namespace App\Modules\HR\Organization\Complaint\Repositories;

use App\Modules\HR\Organization\Complaint\Contracts\ComplaintReminderRepositoryInterface;
use App\Modules\HR\Organization\Complaint\Models\ComplaintReminder;
use Illuminate\Database\Eloquent\Collection;

class ComplaintReminderRepository implements ComplaintReminderRepositoryInterface
{
    public function create(array $data): ComplaintReminder
    {
        return ComplaintReminder::create($data);
    }

    public function findById(string $id): ComplaintReminder
    {
        return ComplaintReminder::findOrFail($id);
    }

    public function update(ComplaintReminder $reminder, array $data): bool
    {
        return $reminder->update($data);
    }

    public function delete(ComplaintReminder $reminder): bool
    {
        return $reminder->delete();
    }

    public function getByComplaintId(string $complaintId): Collection
    {
        return ComplaintReminder::where('complaint_id', $complaintId)
            ->orderBy('remind_at', 'asc')
            ->get();
    }

    public function getPendingReminders(): Collection
    {
        return ComplaintReminder::where('is_sent', false)
            ->where('remind_at', '<=', now())
            ->with('complaint')
            ->get();
    }
}
