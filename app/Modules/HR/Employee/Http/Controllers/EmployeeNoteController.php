<?php

namespace App\Modules\HR\Employee\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\HR\Employee\Contracts\EmployeeNoteRepositoryInterface;
use App\Modules\HR\Employee\Http\Requests\StoreEmployeeNoteRequest;
use App\Modules\HR\Employee\Http\Requests\UpdateEmployeeNoteRequest;
use App\Modules\HR\Employee\Models\Employee;
use App\Modules\HR\Employee\Models\EmployeeNote;
use App\Modules\HR\Employee\Services\EmployeeNoteService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class EmployeeNoteController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private EmployeeNoteService $noteService,
        private EmployeeNoteRepositoryInterface $noteRepository,
    ) {}

    public function index(Employee $employee)
    {
        $notes = $this->noteRepository->getByEmployee($employee->id, Auth::user());

        return response()->json(['notes' => $notes->load(['creator:id,name', 'updater:id,name'])]);
    }

    public function store(StoreEmployeeNoteRequest $request, Employee $employee)
    {
        try {
            $note = $this->noteService->createNote([
                ...$request->validated(),
                'employee_id' => $employee->id,
                'created_by' => $request->user()->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Note created successfully.',
                'note' => $note->load(['creator:id,name', 'updater:id,name']),
            ], 201);
        } catch (\Exception $e) {
            Log::error('Employee note creation failed: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to create note. Please try again.',
            ], 500);
        }
    }

    public function show(Employee $employee, EmployeeNote $note)
    {
        // Ensure the note belongs to the employee
        if ($note->employee_id !== $employee->id) {
            return response()->json([
                'success' => false,
                'message' => 'Note not found.',
            ], 404);
        }

        // Authorize view access
        $this->authorize('view', $note);

        return response()->json(['note' => $note->load(['creator:id,name', 'updater:id,name'])]);
    }

    public function update(UpdateEmployeeNoteRequest $request, Employee $employee, EmployeeNote $note)
    {
        // Ensure the note belongs to the employee
        if ($note->employee_id !== $employee->id) {
            return response()->json([
                'success' => false,
                'message' => 'Note not found.',
            ], 404);
        }

        // Authorize update access
        $this->authorize('update', $note);

        try {
            $updatedNote = $this->noteService->updateNote($note->id, [
                ...$request->validated(),
                'updated_by' => $request->user()->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Note updated successfully.',
                'note' => $updatedNote->load(['creator:id,name', 'updater:id,name']),
            ]);
        } catch (\Exception $e) {
            Log::error('Employee note update failed: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to update note. Please try again.',
            ], 500);
        }
    }

    public function destroy(Employee $employee, EmployeeNote $note)
    {
        // Ensure the note belongs to the employee
        if ($note->employee_id !== $employee->id) {
            return response()->json([
                'success' => false,
                'message' => 'Note not found.',
            ], 404);
        }

        // Authorize delete access
        $this->authorize('delete', $note);

        try {
            $this->noteService->deleteNote($note->id);

            return response()->json([
                'success' => true,
                'message' => 'Note deleted successfully.',
            ]);
        } catch (\Exception $e) {
            Log::error('Employee note deletion failed: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete note. Please try again.',
            ], 500);
        }
    }
}
