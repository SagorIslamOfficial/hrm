<?php

use App\Modules\HR\Organization\Complaint\Http\Controllers\ComplaintController;
use App\Modules\HR\Organization\Complaint\Http\Controllers\ComplaintDocumentController;
use App\Modules\HR\Organization\Complaint\Http\Controllers\ComplaintEscalationController;
use App\Modules\HR\Organization\Complaint\Http\Controllers\ComplaintReminderController;
use App\Modules\HR\Organization\Complaint\Http\Controllers\ComplaintResolutionController;
use App\Modules\HR\Organization\Complaint\Http\Controllers\ComplaintStatusController;
use Illuminate\Support\Facades\Route;

Route::middleware(['complaint.access'])->prefix('organization/complaints')->group(function () {
    // Main Complaints Resource Controller
    Route::resource('/', ComplaintController::class)
        ->parameters(['' => 'complaint'])
        ->names('complaints');

    // Additional complaint actions
    Route::post('{complaint}/submit', [ComplaintStatusController::class, 'submit'])->name('complaints.submit');
    Route::post('{complaint}/status', [ComplaintStatusController::class, 'update'])->name('complaints.updateStatus');
    Route::post('{complaint}/restore', [ComplaintController::class, 'restore'])->name('complaints.restore');
    Route::delete('{complaint}/force', [ComplaintController::class, 'forceDelete'])->name('complaints.forceDelete');

    // Documents (download only - CRUD handled via sync in ComplaintService)
    Route::get('{complaint}/documents/{document}/download', [ComplaintDocumentController::class, 'download'])->name('complaints.documents.download');

    // Escalations
    Route::post('{complaint}/escalations', [ComplaintEscalationController::class, 'store'])->name('complaints.escalations.store');

    // Resolution (Singleton - one per complaint)
    Route::post('{complaint}/resolution', [ComplaintResolutionController::class, 'store'])->name('complaints.resolution.store');
    Route::put('{complaint}/resolution', [ComplaintResolutionController::class, 'update'])->name('complaints.resolution.update');
    Route::post('{complaint}/resolution/feedback', [ComplaintResolutionController::class, 'feedback'])->name('complaints.resolution.feedback');

    // Reminders
    Route::post('{complaint}/reminders', [ComplaintReminderController::class, 'store'])->name('complaints.reminders.store');
});
