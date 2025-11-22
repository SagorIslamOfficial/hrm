<?php

use App\Modules\HR\Organization\Branch\Http\Controllers\BranchController;
use App\Modules\HR\Organization\Branch\Http\Controllers\BranchCustomFieldController;
use App\Modules\HR\Organization\Branch\Http\Controllers\BranchDepartmentController;
use App\Modules\HR\Organization\Branch\Http\Controllers\BranchDocumentController;
use App\Modules\HR\Organization\Branch\Http\Controllers\BranchNoteController;
use Illuminate\Support\Facades\Route;

Route::middleware(['branch.access'])->group(function () {
    Route::prefix('organization')->group(function () {
        // Branches
        Route::resource('branches', BranchController::class);
        Route::post('branches/{branch}/restore', [BranchController::class, 'restore'])
            ->name('branches.restore');
        Route::delete('branches/{branch}/force', [BranchController::class, 'forceDelete'])
            ->name('branches.forceDelete');

        // Branch Departments (nested resource)
        Route::post('branches/{branch}/departments/assign', [BranchDepartmentController::class, 'assign'])
            ->name('branches.departments.assign');
        Route::put('branches/{branch}/departments/{department}', [BranchDepartmentController::class, 'update'])
            ->name('branches.departments.update');
        Route::delete('branches/{branch}/departments/{department}', [BranchDepartmentController::class, 'detach'])
            ->name('branches.departments.detach');

        // Branch Notes (nested resource)
        Route::post('branches/{branch}/notes', [BranchNoteController::class, 'store'])
            ->name('branches.notes.store');
        Route::put('branches/{branch}/notes/{note}', [BranchNoteController::class, 'update'])
            ->name('branches.notes.update');
        Route::delete('branches/{branch}/notes/{note}', [BranchNoteController::class, 'destroy'])
            ->name('branches.notes.destroy');

        // Branch Documents (nested resource)
        Route::resource('branches.documents', BranchDocumentController::class)
            ->except(['create', 'edit']);
        Route::get('branches/{branch}/documents/{document}/download', [BranchDocumentController::class, 'download'])
            ->name('branches.documents.download');

        // Branch Custom Fields (nested resource)
        Route::resource('branches.custom-fields', BranchCustomFieldController::class)
            ->except(['create', 'edit']);
        Route::post('branches/{branch}/custom-fields/sync', [BranchCustomFieldController::class, 'sync'])
            ->name('branches.custom-fields.sync');
    });
});
