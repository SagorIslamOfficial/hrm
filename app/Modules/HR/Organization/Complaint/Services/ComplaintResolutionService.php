<?php

namespace App\Modules\HR\Organization\Complaint\Services;

use App\Modules\HR\Organization\Complaint\Contracts\ComplaintResolutionRepositoryInterface;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintResolutionServiceInterface;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintStatusHistoryRepositoryInterface;
use App\Modules\HR\Organization\Complaint\Models\Complaint;
use Illuminate\Support\Facades\Auth;

class ComplaintResolutionService implements ComplaintResolutionServiceInterface
{
    public function __construct(
        private ComplaintResolutionRepositoryInterface $resolutionRepository,
        private ComplaintStatusHistoryRepositoryInterface $statusHistoryRepository
    ) {}

    // Store resolution for a complaint.
    public function storeResolution(Complaint $complaint, array $data): Complaint
    {
        if (! $complaint->status || ! in_array($complaint->status->value, ['under_review', 'investigating', 'escalated'])) {
            abort(400, 'Complaint cannot be resolved in current status.');
        }

        $previousStatus = $complaint->status;

        $complaint->update([
            'status' => 'resolved',
            'resolved_at' => now(),
        ]);

        $this->resolutionRepository->create([
            'complaint_id' => $complaint->id,
            'resolved_by' => Auth::id(),
            'resolved_at' => now(),
            'data' => $data,
        ]);

        $this->statusHistoryRepository->create([
            'complaint_id' => $complaint->id,
            'from_status' => $previousStatus,
            'to_status' => 'resolved',
            'notes' => 'Complaint resolved',
            'changed_by' => Auth::id(),
        ]);

        return $complaint->fresh();
    }

    // Update an existing resolution.
    public function updateResolution(Complaint $complaint, array $data): Complaint
    {
        $resolution = $this->resolutionRepository->getByComplaintId($complaint->id);

        if (! $resolution) {
            abort(400, 'No resolution found for this complaint.');
        }

        $currentData = $resolution->data ?? [];
        $this->resolutionRepository->update($resolution, [
            'data' => array_merge($currentData, $data),
        ]);

        return $complaint->fresh();
    }

    // Record complainant feedback on resolution.
    public function recordFeedback(Complaint $complaint, array $data): Complaint
    {
        if ($complaint->employee_id !== Auth::id() && ! Auth::user()->hasAnyRole(['Admin', 'HR'])) {
            abort(403, 'Unauthorized to provide feedback.');
        }

        $resolution = $this->resolutionRepository->getByComplaintId($complaint->id);

        if (! $resolution) {
            abort(400, 'No resolution found for this complaint.');
        }

        $currentData = $resolution->data ?? [];
        $this->resolutionRepository->update($resolution, [
            'data' => array_merge($currentData, $data),
        ]);

        if ($data['satisfactory_to_complainant'] ?? false) {
            $complaint->update([
                'status' => 'closed',
                'closed_at' => now(),
            ]);

            $this->statusHistoryRepository->create([
                'complaint_id' => $complaint->id,
                'from_status' => 'resolved',
                'to_status' => 'closed',
                'notes' => 'Closed after positive feedback',
                'changed_by' => Auth::id(),
            ]);
        }

        return $complaint->fresh();
    }
}
