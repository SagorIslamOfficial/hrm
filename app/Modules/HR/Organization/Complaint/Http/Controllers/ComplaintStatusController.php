<?php

namespace App\Modules\HR\Organization\Complaint\Http\Controllers;

use App\Modules\HR\Organization\Complaint\Contracts\ComplaintStatusServiceInterface;
use App\Modules\HR\Organization\Complaint\Http\Requests\UpdateComplaintStatusRequest;
use App\Modules\HR\Organization\Complaint\Models\Complaint;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;

class ComplaintStatusController
{
    use AuthorizesRequests;

    public function __construct(
        private ComplaintStatusServiceInterface $statusService
    ) {}

    // Submit complaint for review.
    public function submit(Complaint $complaint): RedirectResponse
    {
        $this->authorize('submit', $complaint);

        $complaint = $this->statusService->submitComplaint($complaint->id);

        return redirect()
            ->route('complaints.show', $complaint)
            ->with('success', 'Complaint submitted successfully.');
    }

    // Update complaint status.
    public function update(UpdateComplaintStatusRequest $request, Complaint $complaint): RedirectResponse
    {
        $this->authorize('updateStatus', $complaint);

        $data = $request->validated();
        $complaint = $this->statusService->updateComplaintStatus($complaint->id, $data['status'], $data['notes'] ?? null);

        return redirect()
            ->route('complaints.show', $complaint)
            ->with('success', 'Complaint status updated successfully.');
    }
}
