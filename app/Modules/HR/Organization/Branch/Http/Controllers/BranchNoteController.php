<?php

namespace App\Modules\HR\Organization\Branch\Http\Controllers;

use App\Modules\HR\Organization\Branch\Models\Branch;
use App\Modules\HR\Organization\Branch\Models\BranchNote;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BranchNoteController
{
    use AuthorizesRequests;

    public function store(Request $request, string $branchId)
    {
        $branch = Branch::findOrFail($branchId);
        $this->authorize('update', $branch);

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'note' => 'required|string',
            'category' => 'required|in:general,performance,disciplinary,achievement,other',
            'is_private' => 'sometimes|boolean',
        ]);

        try {
            $note = $branch->notes()->create([
                ...$validated,
                'created_by' => Auth::id(),
                'updated_by' => Auth::id(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Note created successfully.',
                'note' => $note->load(['creator:id,name', 'updater:id,name']),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create note. Please try again.',
            ], 500);
        }
    }

    public function update(Request $request, string $branchId, string $noteId)
    {
        $branch = Branch::findOrFail($branchId);
        $this->authorize('update', $branch);

        $note = BranchNote::where('branch_id', $branchId)
            ->findOrFail($noteId);

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'note' => 'required|string',
            'category' => 'required|in:general,performance,disciplinary,achievement,other',
            'is_private' => 'sometimes|boolean',
        ]);

        try {
            $note->update([
                ...$validated,
                'updated_by' => Auth::id(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Note updated successfully.',
                'note' => $note->load(['creator:id,name', 'updater:id,name']),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update note. Please try again.',
            ], 500);
        }
    }

    public function destroy(string $branchId, string $noteId)
    {
        $branch = Branch::findOrFail($branchId);
        $this->authorize('update', $branch);

        $note = BranchNote::where('branch_id', $branchId)
            ->findOrFail($noteId);

        try {
            $note->delete();

            return response()->json([
                'success' => true,
                'message' => 'Note deleted successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete note. Please try again.',
            ], 500);
        }
    }
}
