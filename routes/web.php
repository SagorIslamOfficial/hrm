<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->middleware('throttle:web')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->middleware('throttle:web')->name('dashboard');

    // Added module routes with dashboard prefix
    Route::prefix('dashboard')->group(function () {
        require __DIR__.'/../app/Modules/Employee/Routes/web.php';
        require __DIR__.'/../app/Modules/Department/Routes/web.php';
        require __DIR__.'/../app/Modules/Attendance/Routes/web.php';
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
