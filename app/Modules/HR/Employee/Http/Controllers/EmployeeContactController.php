<?php

namespace App\Modules\HR\Employee\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\HR\Employee\Http\Requests\StoreEmployeeContactRequest;
use App\Modules\HR\Employee\Http\Requests\UpdateEmployeeContactRequest;
use App\Modules\HR\Employee\Models\Employee;
use App\Modules\HR\Employee\Models\EmployeeContact;
use Illuminate\Support\Facades\Log;

class EmployeeContactController extends Controller
{
    public function index(Employee $employee)
    {
        $contacts = $employee->contacts()
            ->orderBy('is_primary', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['contacts' => $contacts]);
    }

    public function store(StoreEmployeeContactRequest $request, Employee $employee)
    {
        try {
            $data = $request->validated();
            $data['employee_id'] = $employee->id;

            // If this contact is set as primary, remove primary flag from others
            if ($data['is_primary'] ?? false) {
                $employee->contacts()->update(['is_primary' => false]);
            }

            $contact = EmployeeContact::create($data);

            // Handle photo upload if provided
            if ($request->hasFile('photo')) {
                try {
                    $contact->uploadPhoto($request->file('photo'));
                } catch (\Exception $e) {
                    Log::error('Contact photo upload failed during creation: '.$e->getMessage());
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Emergency contact added successfully.',
                'contact' => $contact->fresh(),
            ], 201);
        } catch (\Exception $e) {
            Log::error('Employee contact creation failed: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to add emergency contact. Please try again.',
            ], 500);
        }
    }

    public function show(Employee $employee, EmployeeContact $contact)
    {
        // Ensure the contact belongs to the employee
        if ($contact->employee_id !== $employee->id) {
            return response()->json([
                'success' => false,
                'message' => 'Contact not found.',
            ], 404);
        }

        return response()->json(['contact' => $contact]);
    }

    public function update(UpdateEmployeeContactRequest $request, Employee $employee, EmployeeContact $contact)
    {
        try {
            // Ensure the contact belongs to the employee
            if ($contact->employee_id !== $employee->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Contact not found.',
                ], 404);
            }

            $data = $request->validated();

            // If this contact is set as primary, remove primary flag from others
            if ($data['is_primary'] ?? false) {
                $employee->contacts()
                    ->where('id', '!=', $contact->id)
                    ->update(['is_primary' => false]);
            }

            $contact->update($data);

            // Handle photo upload if provided
            if ($request->hasFile('photo')) {
                try {
                    $contact->uploadPhoto($request->file('photo'));
                } catch (\Exception $e) {
                    Log::error('Contact photo upload failed during update: '.$e->getMessage());
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Emergency contact updated successfully.',
                'contact' => $contact->fresh(),
            ]);
        } catch (\Exception $e) {
            Log::error('Employee contact update failed: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to update emergency contact. Please try again.',
            ], 500);
        }
    }

    public function destroy(Employee $employee, EmployeeContact $contact)
    {
        try {
            // Ensure the contact belongs to the employee
            if ($contact->employee_id !== $employee->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Contact not found.',
                ], 404);
            }

            $contact->delete();

            return response()->json([
                'success' => true,
                'message' => 'Emergency contact deleted successfully.',
            ]);
        } catch (\Exception $e) {
            Log::error('Employee contact deletion failed: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete emergency contact. Please try again.',
            ], 500);
        }
    }
}
