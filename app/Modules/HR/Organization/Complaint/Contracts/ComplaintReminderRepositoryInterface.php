<?php

namespace App\Modules\HR\Organization\Complaint\Contracts;

use App\Modules\HR\Organization\Complaint\Models\ComplaintReminder;
use Illuminate\Database\Eloquent\Collection;

interface ComplaintReminderRepositoryInterface
{
    public function create(array $data): ComplaintReminder;

    public function findById(string $id): ComplaintReminder;

    public function update(ComplaintReminder $reminder, array $data): bool;

    public function delete(ComplaintReminder $reminder): bool;

    public function getByComplaintId(string $complaintId): Collection;

    public function getPendingReminders(): Collection;
}
