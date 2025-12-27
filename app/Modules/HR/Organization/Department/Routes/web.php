<?php

use App\Modules\HR\Organization\Department\Http\Controllers\DepartmentController;
use App\Modules\HR\Organization\Department\Http\Controllers\DesignationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['department.access'])->group(function () {
    Route::prefix('organization')->group(function () {
        // Departments
        Route::resource('departments', DepartmentController::class);
        Route::post('departments/{department}/restore', [DepartmentController::class, 'restore'])
            ->name('departments.restore');
        Route::delete('departments/{department}/force', [DepartmentController::class, 'forceDelete'])
            ->name('departments.forceDelete');

        // Designations
        Route::resource('designations', DesignationController::class);
        Route::post('designations/{designation}/restore', [DesignationController::class, 'restore'])
            ->name('designations.restore');
        Route::delete('designations/{designation}/force', [DesignationController::class, 'forceDelete'])
            ->name('designations.forceDelete');
    });
});
