<?php

namespace App\Modules\Employee\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Employee\Contracts\EmployeeDocumentRepositoryInterface;
use App\Modules\Employee\Contracts\EmployeeDocumentServiceInterface;
use App\Modules\Employee\Http\Requests\StoreEmployeeDocumentRequest;
use App\Modules\Employee\Http\Requests\UpdateEmployeeDocumentRequest;
use App\Modules\Employee\Models\Employee;
use App\Modules\Employee\Models\EmployeeDocument;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class EmployeeDocumentController extends Controller
{
    public function __construct(
        private EmployeeDocumentServiceInterface $documentService,
        private EmployeeDocumentRepositoryInterface $documentRepository,
    ) {}

    public function index(Employee $employee)
    {
        $documents = $this->documentRepository->getByEmployeeId($employee->id);

        return response()->json(['documents' => $documents]);
    }

    public function store(StoreEmployeeDocumentRequest $request, Employee $employee)
    {
        try {
            $data = $request->validated();
            $document = $this->documentService->createDocument($employee->id, $data);

            return response()->json([
                'success' => true,
                'message' => 'Document uploaded successfully.',
                'document' => $document,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Employee document creation failed: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to upload document. Please try again.',
            ], 500);
        }
    }

    public function show(Employee $employee, EmployeeDocument $document)
    {
        // Ensure the document belongs to the employee
        if ($document->employee_id !== $employee->id) {
            return response()->json([
                'success' => false,
                'message' => 'Document not found.',
            ], 404);
        }

        return response()->json(['document' => $document->load('uploader:id,name')]);
    }

    public function update(UpdateEmployeeDocumentRequest $request, Employee $employee, EmployeeDocument $document)
    {
        try {
            // Ensure the document belongs to the employee
            if ($document->employee_id !== $employee->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Document not found.',
                ], 404);
            }

            $data = $request->validated();
            $document = $this->documentService->updateDocument($document->id, $data);

            return response()->json([
                'success' => true,
                'message' => 'Document updated successfully.',
                'document' => $document,
            ]);
        } catch (\Exception $e) {
            Log::error('Employee document update failed: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to update document. Please try again.',
            ], 500);
        }
    }

    public function destroy(Employee $employee, EmployeeDocument $document)
    {
        try {
            // Ensure the document belongs to the employee
            if ($document->employee_id !== $employee->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Document not found.',
                ], 404);
            }

            $this->documentService->deleteDocument($document->id);

            return response()->json([
                'success' => true,
                'message' => 'Document deleted successfully.',
            ]);
        } catch (\Exception $e) {
            Log::error('Employee document deletion failed: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete document. Please try again.',
            ], 500);
        }
    }

    /**
     * Download a document file
     */
    public function download(Employee $employee, EmployeeDocument $document)
    {
        try {
            // Ensure the document belongs to the employee
            if ($document->employee_id !== $employee->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Document not found.',
                ], 404);
            }

            if (! $document->file_path) {
                return response()->json([
                    'success' => false,
                    'message' => 'Document file not found.',
                ], 404);
            }

            if (! Storage::disk('public')->exists($document->file_path)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Document file does not exist on storage.',
                ], 404);
            }

            $filePath = Storage::disk('public')->path($document->file_path);

            return response()->download(
                $filePath,
                $document->file_name ?? basename($document->file_path)
            );
        } catch (\Exception $e) {
            Log::error('Document download failed: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to download document. Please try again.',
            ], 500);
        }
    }
}
