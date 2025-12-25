<?php

namespace App\Modules\HR\Organization\Complaint\Policies;

use App\Models\User;
use App\Modules\HR\Organization\Complaint\Models\Complaint;

class ComplaintPolicy
{
    // Determine whether the user can view any models.
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['Admin', 'HR', 'Manager', 'Employee']);
    }

    // Determine whether the user can view the model.
    public function view(User $user, Complaint $complaint): bool
    {
        // Admin and HR can view all
        if ($user->hasAnyRole(['Admin', 'HR'])) {
            return true;
        }

        // Complainant can view their own
        if ($complaint->employee_id === $user->employee?->id) {
            return true;
        }

        // Assigned handler can view
        if ($complaint->assigned_to === $user->id) {
            return true;
        }

        // Manager can view department complaints
        if ($user->hasRole('Manager') && $complaint->department_id === $user->employee?->department_id) {
            return true;
        }

        return false;
    }

    // Determine whether the user can create models.
    public function create(User $user): bool
    {
        return $user->hasAnyRole(['Admin', 'HR', 'Manager', 'Employee']);
    }

    // Determine whether the user can update the model.
    public function update(User $user, Complaint $complaint): bool
    {
        // Only allow updates to draft complaints
        if (! $complaint->status || $complaint->status->value !== 'draft') {
            return false;
        }

        // Admin and HR can update any
        if ($user->hasAnyRole(['Admin', 'HR'])) {
            return true;
        }

        // Complainant can update their own draft
        return $complaint->employee_id === $user->employee?->id;
    }

    // Determine whether the user can submit the complaint.
    public function submit(User $user, Complaint $complaint): bool
    {
        // Must be in draft status
        if (! $complaint->status || $complaint->status->value !== 'draft') {
            return false;
        }

        return $complaint->employee_id === $user->employee?->id || $user->hasAnyRole(['Admin', 'HR']);
    }

    // Determine whether the user can update status.
    public function updateStatus(User $user, Complaint $complaint): bool
    {
        return $user->hasAnyRole(['Admin', 'HR']) || $complaint->assigned_to === $user->id;
    }

    // Determine whether the user can escalate the complaint.
    public function escalate(User $user, Complaint $complaint): bool
    {
        return $user->hasAnyRole(['Admin', 'HR', 'Manager']) || $complaint->assigned_to === $user->id;
    }

    // Determine whether the user can add comments.
    public function addComment(User $user, Complaint $complaint): bool
    {
        return $this->view($user, $complaint);
    }

    // Determine whether the user can upload documents.
    public function uploadDocument(User $user, Complaint $complaint): bool
    {
        return $this->view($user, $complaint);
    }

    // Determine whether the user can delete the model.
    public function delete(User $user, Complaint $complaint): bool
    {
        // Only draft complaints can be deleted
        if (! $complaint->status || $complaint->status->value !== 'draft') {
            return false;
        }

        return $user->hasAnyRole(['Admin', 'HR']) || $complaint->employee_id === $user->employee?->id;
    }

    // Determine whether the user can restore the model.
    public function restore(User $user, Complaint $complaint): bool
    {
        return $user->hasAnyRole(['Admin', 'HR']);
    }

    // Determine whether the user can permanently delete the model.
    public function forceDelete(User $user, Complaint $complaint): bool
    {
        return $user->hasRole('Admin');
    }
}
