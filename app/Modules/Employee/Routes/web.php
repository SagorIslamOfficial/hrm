<?php

use App\Modules\Employee\Http\Controllers\EmployeeContactController;
use App\Modules\Employee\Http\Controllers\EmployeeController;
use App\Modules\Employee\Http\Controllers\EmploymentTypeController;
use Illuminate\Support\Facades\Route;

Route::middleware(['employee.access'])->group(function () {
    // Main Employee
    Route::resource('employees', EmployeeController::class);

    // Contact
    Route::resource('employees.contacts', EmployeeContactController::class)
        ->except(['create', 'edit']);

    // Type
    Route::resource('employment-types', EmploymentTypeController::class)
        ->parameters(['employment-types' => 'employmentType'])
        ->names('employment-types');
});
