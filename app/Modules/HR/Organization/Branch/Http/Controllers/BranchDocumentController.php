<?php

namespace App\Modules\HR\Organization\Branch\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\HR\Organization\Branch\Http\Requests\StoreBranchRequest;
use App\Modules\HR\Organization\Branch\Http\Requests\UpdateBranchRequest;
use App\Modules\HR\Organization\Branch\Models\Branch;
use App\Modules\HR\Organization\Branch\Models\BranchDocument;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class BranchDocumentController extends Controller
{
    use AuthorizesRequests;

    public function index(Branch $branch)
    {
        $this->authorize('viewAny', BranchDocument::class);

        $documents = $branch->documents()->with('uploader:id,name')->get();

        return response()->json(['data' => $documents]);
    }

    public function store(StoreBranchRequest $request, Branch $branch)
    {
        $this->authorize('create', BranchDocument::class);

        try {
            $data = $request->validated();
            $data['branch_id'] = $branch->id;
            $data['uploaded_by'] = Auth::id();

            $document = BranchDocument::create($data);

            if ($request->hasFile('file')) {
                $document->uploadDocument($request->file('file'));
            }

            return response()->json([
                'success' => true,
                'message' => 'Document uploaded successfully.',
                'data' => $document->load('uploader:id,name'),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload document. Please try again.',
            ], 500);
        }
    }

    public function show(Branch $branch, BranchDocument $document)
    {
        $this->authorize('view', $document);

        // Ensure the document belongs to the branch
        if ($document->branch_id !== $branch->id) {
            return response()->json([
                'success' => false,
                'message' => 'Document not found.',
            ], 404);
        }

        return response()->json(['data' => $document->load('uploader:id,name')]);
    }

    public function update(UpdateBranchRequest $request, Branch $branch, BranchDocument $document)
    {
        $this->authorize('update', $document);

        try {
            // Ensure the document belongs to the branch
            if ($document->branch_id !== $branch->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Document not found.',
                ], 404);
            }

            $data = $request->validated();
            $document->update($data);

            if ($request->hasFile('file')) {
                $document->uploadDocument($request->file('file'));
            }

            return response()->json([
                'success' => true,
                'message' => 'Document updated successfully.',
                'data' => $document->fresh()->load('uploader:id,name'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update document. Please try again.',
            ], 500);
        }
    }

    public function destroy(Branch $branch, BranchDocument $document)
    {
        $this->authorize('delete', $document);

        try {
            // Ensure the document belongs to the branch
            if ($document->branch_id !== $branch->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Document not found.',
                ], 404);
            }

            $document->delete();

            return response()->json([
                'success' => true,
                'message' => 'Document deleted successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete document. Please try again.',
            ], 500);
        }
    }

    /**
     * Download a document file
     */
    public function download(Branch $branch, BranchDocument $document)
    {
        $this->authorize('download', $document);

        try {
            // Ensure the document belongs to the branch
            if ($document->branch_id !== $branch->id) {
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
            return response()->json([
                'success' => false,
                'message' => 'Failed to download document. Please try again.',
            ], 500);
        }
    }
}
