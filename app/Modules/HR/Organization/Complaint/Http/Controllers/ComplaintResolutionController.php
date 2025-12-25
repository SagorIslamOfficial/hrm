<?php

namespace App\Modules\HR\Organization\Complaint\Http\Controllers;

use App\Modules\HR\Organization\Complaint\Contracts\ComplaintResolutionServiceInterface;
use App\Modules\HR\Organization\Complaint\Models\Complaint;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ComplaintResolutionController
{
    use AuthorizesRequests;

    public function __construct(
        private ComplaintResolutionServiceInterface $resolutionService
    ) {}

    // Store a newly created resolution.
    public function store(Request $request, Complaint $complaint): RedirectResponse
    {
        $this->authorize('updateStatus', $complaint);

        $this->resolutionService->storeResolution($complaint, $request->all());

        return back()->with('success', 'Complaint resolved successfully.');
    }

    // Update the specified resolution.
    public function update(Request $request, Complaint $complaint): RedirectResponse
    {
        $this->authorize('updateStatus', $complaint);

        $this->resolutionService->updateResolution($complaint, $request->all());

        return back()->with('success', 'Resolution updated successfully.');
    }

    // Record complainant feedback on resolution.
    public function feedback(Request $request, Complaint $complaint): RedirectResponse
    {
        $this->resolutionService->recordFeedback($complaint, $request->all());

        return back()->with('success', 'Feedback recorded successfully.');
    }
}
