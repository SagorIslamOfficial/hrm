<?php

namespace App\Modules\HR\Organization\Complaint\Http\Controllers;

use App\Modules\HR\Organization\Complaint\Contracts\ComplaintEscalationServiceInterface;
use App\Modules\HR\Organization\Complaint\Models\Complaint;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ComplaintEscalationController
{
    use AuthorizesRequests;

    public function __construct(
        private ComplaintEscalationServiceInterface $escalationService
    ) {}

    // Store a new escalation.
    public function store(Request $request, Complaint $complaint): RedirectResponse
    {
        $this->authorize('escalate', $complaint);

        $validated = $request->validate([
            'escalated_to' => ['required', 'array', 'min:1'],
            'escalated_to.*' => ['exists:users,id'],
            'reason' => ['required', 'string', 'max:1000'],
        ]);

        $this->escalationService->storeEscalation($complaint, $validated);

        return back()->with('success', 'Complaint escalated successfully.');
    }
}
