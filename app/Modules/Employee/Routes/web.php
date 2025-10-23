<?php

use App\Modules\Employee\Http\Controllers\EmployeeContactController;
use App\Modules\Employee\Http\Controllers\EmployeeController;
use App\Modules\Employee\Http\Controllers\EmployeeDocumentController;
use App\Modules\Employee\Http\Controllers\EmploymentTypeController;
use Illuminate\Support\Facades\Route;

Route::middleware(['employee.access'])->group(function () {
    // Main Employee
    Route::resource('employees', EmployeeController::class);

    // Contact
    Route::resource('employees.contacts', EmployeeContactController::class)
        ->except(['create', 'edit']);

    // Documents
    Route::resource('employees.documents', EmployeeDocumentController::class)
        ->except(['create', 'edit']);

    // Document Download
    Route::get('employees/{employee}/documents/{document}/download', [EmployeeDocumentController::class, 'download'])
        ->name('employees.documents.download');

    // Type
    Route::resource('employment-types', EmploymentTypeController::class)
        ->parameters(['employment-types' => 'employmentType'])
        ->names('employment-types');
});
