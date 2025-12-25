<?php

namespace App\Modules\HR\Organization\Complaint\Http\Controllers;

use App\Modules\HR\Organization\Complaint\Contracts\ComplaintReminderServiceInterface;
use App\Modules\HR\Organization\Complaint\Models\Complaint;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ComplaintReminderController
{
    use AuthorizesRequests;

    public function __construct(
        private ComplaintReminderServiceInterface $reminderService
    ) {}

    // Display a listing of reminders for a complaint.
    public function index(Complaint $complaint): JsonResponse
    {
        $this->authorize('view', $complaint);

        $reminders = $complaint->reminders()
            ->orderBy('remind_at', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $reminders,
        ]);
    }

    // Store a newly created reminder.
    public function store(Request $request, Complaint $complaint): RedirectResponse
    {
        $this->authorize('updateStatus', $complaint);

        $this->reminderService->createReminder($complaint, $request->all());

        return redirect()->back()->with('success', 'Reminder created successfully.');
    }
}
