<?php

namespace App\Modules\HR\Organization\Complaint\Http\Controllers;

use App\Modules\HR\Organization\Complaint\Contracts\ComplaintDocumentServiceInterface;
use App\Modules\HR\Organization\Complaint\Models\Complaint;
use App\Modules\HR\Organization\Complaint\Models\ComplaintDocument;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ComplaintDocumentController
{
    use AuthorizesRequests;

    public function __construct(
        private ComplaintDocumentServiceInterface $documentService
    ) {}

    // Download a complaint document.
    public function download(Complaint $complaint, ComplaintDocument $document): StreamedResponse
    {
        $this->authorize('view', $complaint);
        if ($document->complaint_id !== $complaint->id) {
            abort(404);
        }

        return $this->documentService->downloadDocument($document);
    }

    // View/stream a complaint document (inline display).
    public function view(Complaint $complaint, ComplaintDocument $document): StreamedResponse
    {
        $this->authorize('view', $complaint);
        if ($document->complaint_id !== $complaint->id) {
            abort(404);
        }

        return $this->documentService->viewDocument($document);
    }
}
