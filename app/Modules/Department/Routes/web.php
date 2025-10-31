<?php

use App\Modules\Department\Http\Controllers\DepartmentController;
use Illuminate\Support\Facades\Route;

Route::middleware(['department.access'])->group(function () {
    Route::resource('departments', DepartmentController::class)->names('departments');
});
