<?php

namespace App\Modules\Employee\Services;

use App\Modules\Employee\Contracts\EmployeeDocumentRepositoryInterface;
use App\Modules\Employee\Contracts\EmployeeDocumentServiceInterface;
use App\Modules\Employee\Models\EmployeeDocument;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class EmployeeDocumentService implements EmployeeDocumentServiceInterface
{
    public function __construct(
        private EmployeeDocumentRepositoryInterface $documentRepository
    ) {}

    /**
     * Create a new document for an employee.
     */
    public function createDocument(int|string $employeeId, array $data): EmployeeDocument
    {
        return DB::transaction(function () use ($employeeId, $data) {
            $documentData = [
                'employee_id' => $employeeId,
                'doc_type' => $data['doc_type'],
                'title' => $data['title'],
                'expiry_date' => $data['expiry_date'] ?? null,
                'uploaded_by' => Auth::id(),
            ];

            $document = $this->documentRepository->create($documentData);

            // Load the employee relationship before uploading file
            $document->load('employee');

            // Handle file upload if provided
            if (isset($data['file'])) {
                $success = $document->uploadDocument($data['file']);
                if (! $success) {
                    throw new \Exception('Failed to upload document file.');
                }
            }

            return $document->fresh(['uploader']);
        });
    }

    /**
     * Update an existing document.
     */
    public function updateDocument(int|string $documentId, array $data): EmployeeDocument
    {
        return DB::transaction(function () use ($documentId, $data) {
            $document = $this->documentRepository->findById($documentId);

            // Load the employee relationship before potential file upload
            $document->load('employee');

            $updateData = array_filter([
                'doc_type' => $data['doc_type'] ?? null,
                'title' => $data['title'] ?? null,
                'expiry_date' => $data['expiry_date'] ?? null,
            ], fn ($value) => $value !== null);

            if (! empty($updateData)) {
                $this->documentRepository->update($document, $updateData);
            }

            // Handle file upload if provided (replace existing file)
            if (isset($data['file'])) {
                $success = $document->uploadDocument($data['file']);
                if (! $success) {
                    throw new \Exception('Failed to upload document file.');
                }
            }

            return $document->fresh(['uploader']);
        });
    }

    /**
     * Delete a document.
     */
    public function deleteDocument(int|string $documentId): void
    {
        $document = $this->documentRepository->findById($documentId);
        $this->documentRepository->delete($document);
    }
}
