<?php

namespace App\Modules\HR\Organization\Complaint\Contracts;

use App\Modules\HR\Organization\Complaint\Models\Complaint;
use App\Modules\HR\Organization\Complaint\Models\ComplaintDocument;
use Illuminate\Http\UploadedFile;
use Symfony\Component\HttpFoundation\StreamedResponse;

interface ComplaintDocumentServiceInterface
{
    public function createDocument(Complaint $complaint, UploadedFile $file, array $data): ComplaintDocument;

    public function deleteDocument(ComplaintDocument $document): bool;

    public function downloadDocument(ComplaintDocument $document): StreamedResponse;

    public function syncDocuments(Complaint $complaint, array $documents): void;
}
