<?php

use App\Http\Controllers\User\UserActivityLogController;
use App\Http\Controllers\User\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::prefix('dashboard')->group(function () {
        Route::resource('users', UserController::class);

        // Employee linking routes
        Route::post('users/{user}/link-employee', [UserController::class, 'linkEmployee'])
            ->name('users.link-employee');
        Route::delete('users/{user}/unlink-employee', [UserController::class, 'unlinkEmployee'])
            ->name('users.unlink-employee');

        // User status route
        Route::patch('users/{user}/status', [UserController::class, 'updateStatus'])
            ->name('users.update-status');

        // Send welcome email route
        Route::post('users/{user}/send-welcome-email', [UserController::class, 'sendWelcomeEmail'])
            ->name('users.send-welcome-email');

        // Activity log route
        Route::get('users/{user}/activity-logs', [UserActivityLogController::class, 'index'])
            ->name('users.activity-logs');
    });
});
