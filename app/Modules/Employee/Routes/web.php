<?php

use App\Modules\Employee\Http\Controllers\EmployeeContactController;
use App\Modules\Employee\Http\Controllers\EmployeeController;
use App\Modules\Employee\Http\Controllers\EmployeeCustomFieldController;
use App\Modules\Employee\Http\Controllers\EmployeeDocumentController;
use App\Modules\Employee\Http\Controllers\EmployeeNoteController;
use App\Modules\Employee\Http\Controllers\EmploymentTypeController;
use Illuminate\Support\Facades\Route;

Route::middleware(['employee.access'])->group(function () {
    Route::prefix('employee')->group(function () {
        // Employment Types
        Route::resource('employment-types', EmploymentTypeController::class)
            ->parameters(['employment-types' => 'employmentType'])
            ->names('employment-types');

        // Main Employee
        Route::resource('', EmployeeController::class)
            ->parameters(['' => 'employee'])
            ->names('employees');

        // Nested resources under specific employee
        Route::resource('{employee}/contacts', EmployeeContactController::class)
            ->names('employees.contacts')
            ->except(['create', 'edit']);

        Route::get('{employee}/documents/{document}/download', [EmployeeDocumentController::class, 'download'])
            ->name('employees.documents.download');

        Route::resource('{employee}/documents', EmployeeDocumentController::class)
            ->names('employees.documents')
            ->except(['create', 'edit']);

        Route::resource('{employee}/notes', EmployeeNoteController::class)
            ->names('employees.notes')
            ->except(['create', 'edit']);

        Route::post('{employee}/custom-fields/sync', [EmployeeCustomFieldController::class, 'sync'])
            ->name('employees.custom-fields.sync');

        Route::resource('{employee}/custom-fields', EmployeeCustomFieldController::class)
            ->names('employees.custom-fields')
            ->except(['create', 'edit']);
    });
});
