<?php

namespace App\Modules\HR\Organization\Complaint\Services;

use App\Modules\HR\Organization\Complaint\Contracts\ComplaintDocumentRepositoryInterface;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintDocumentServiceInterface;
use App\Modules\HR\Organization\Complaint\Models\Complaint;
use App\Modules\HR\Organization\Complaint\Models\ComplaintDocument;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ComplaintDocumentService implements ComplaintDocumentServiceInterface
{
    public function __construct(
        private ComplaintDocumentRepositoryInterface $documentRepository
    ) {}

    // Upload and create a new document for a complaint.
    public function createDocument(Complaint $complaint, UploadedFile $file, array $data): ComplaintDocument
    {
        $disk = config('complaint.uploads.disk', 'private');

        // Generate custom filename
        $complaintNum = Str::slug($complaint->complaint_number ?? 'complaint-'.$complaint->id);
        $titleSlug = Str::slug($data['title'] ?? $data['doc_type'] ?? 'document');
        $timestamp = now()->format('YmdHis');
        $uniqid = uniqid();
        $extension = $file->getClientOriginalExtension();

        $filename = "{$complaintNum}-{$titleSlug}-{$timestamp}-{$uniqid}.{$extension}";
        $path = $file->storeAs('complaints/documents', $filename, $disk);

        return $this->documentRepository->create([
            'complaint_id' => $complaint->id,
            'title' => $data['title'] ?? $file->getClientOriginalName(),
            'description' => $data['description'] ?? null,
            'file_path' => $path,
            'doc_type' => $data['doc_type'] ?? 'evidence',
            'uploaded_by' => Auth::id(),
        ]);
    }

    // Delete a document and its file.
    public function deleteDocument(ComplaintDocument $document): bool
    {
        $document->deleteFile();

        return $this->documentRepository->delete($document);
    }

    // Download a document.
    public function downloadDocument(ComplaintDocument $document): StreamedResponse
    {
        $disk = config('complaint.uploads.disk', 'private');

        /** @var \Illuminate\Filesystem\FilesystemAdapter $storage */
        $storage = Storage::disk($disk);

        if (! $storage->exists($document->file_path)) {
            abort(404, 'Document not found');
        }

        $extension = pathinfo($document->file_path, PATHINFO_EXTENSION);
        $filename = Str::slug($document->title).'.'.$extension;

        return $storage->download($document->file_path, $filename);
    }

    // View a document (inline display).
    public function viewDocument(ComplaintDocument $document): StreamedResponse
    {
        $disk = config('complaint.uploads.disk', 'private');

        /** @var \Illuminate\Filesystem\FilesystemAdapter $storage */
        $storage = Storage::disk($disk);

        if (! $storage->exists($document->file_path)) {
            abort(404, 'Document not found');
        }

        $mimeType = $storage->mimeType($document->file_path);

        return $storage->response($document->file_path, null, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'inline',
        ]);
    }

    // Sync documents (create new, update metadata, delete removed).
    public function syncDocuments(Complaint $complaint, array $documents): void
    {
        foreach ($documents as $docData) {
            // Handle deletions
            if (isset($docData['_isDeleted']) && filter_var($docData['_isDeleted'], FILTER_VALIDATE_BOOLEAN)) {
                if (isset($docData['id']) && ! str_starts_with($docData['id'], 'temp-')) {
                    $document = $this->documentRepository->findById($docData['id']);
                    if ($document) {
                        $this->deleteDocument($document);
                    }
                }

                continue;
            }

            // Handle new documents
            if (isset($docData['_isNew']) && filter_var($docData['_isNew'], FILTER_VALIDATE_BOOLEAN)) {
                if (isset($docData['file']) && $docData['file'] instanceof UploadedFile) {
                    $this->createDocument($complaint, $docData['file'], $docData);
                }

                continue;
            }

            // Handle modified existing documents (metadata only)
            if (isset($docData['_isModified']) && filter_var($docData['_isModified'], FILTER_VALIDATE_BOOLEAN)) {
                if (isset($docData['id']) && ! str_starts_with($docData['id'], 'temp-')) {
                    $document = $this->documentRepository->findById($docData['id']);
                    if ($document) {
                        $updateData = [
                            'title' => $docData['title'],
                            'description' => $docData['description'] ?? null,
                            'doc_type' => $docData['doc_type'],
                        ];

                        // Handle file replacement
                        if (isset($docData['file']) && $docData['file'] instanceof UploadedFile) {
                            $document->deleteFile();

                            $file = $docData['file'];
                            $disk = config('complaint.uploads.disk', 'private');

                            $complaintNum = Str::slug($complaint->complaint_number ?? 'complaint-'.$complaint->id);
                            $titleSlug = Str::slug($docData['title'] ?? $docData['doc_type'] ?? 'document');
                            $timestamp = now()->format('YmdHis');
                            $uniqid = uniqid();
                            $extension = $file->getClientOriginalExtension();

                            $filename = "{$complaintNum}-{$titleSlug}-{$timestamp}-{$uniqid}.{$extension}";
                            $path = $file->storeAs('complaints/documents', $filename, $disk);

                            $updateData['file_path'] = $path;
                            $updateData['uploaded_by'] = Auth::id();
                        } elseif ($document->title !== $docData['title']) {
                            // If title changed but file is NOT replaced, rename the existing file
                            $disk = config('complaint.uploads.disk', 'private');
                            $storage = Storage::disk($disk);

                            if ($storage->exists($document->file_path)) {
                                $extension = pathinfo($document->file_path, PATHINFO_EXTENSION);
                                $complaintNum = Str::slug($complaint->complaint_number ?? 'complaint-'.$complaint->id);
                                $titleSlug = Str::slug($docData['title']);
                                $timestamp = now()->format('YmdHis');
                                $uniqid = uniqid();

                                $newFilename = "{$complaintNum}-{$titleSlug}-{$timestamp}-{$uniqid}.{$extension}";
                                $newPath = "complaints/documents/{$newFilename}";

                                if ($storage->move($document->file_path, $newPath)) {
                                    $updateData['file_path'] = $newPath;
                                }
                            }
                        }

                        $this->documentRepository->update($document, $updateData);
                    }
                }
            }
        }
    }
}
