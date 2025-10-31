<?php

use App\Modules\Attendance\Http\Controllers\AttendanceController;
use Illuminate\Support\Facades\Route;

Route::middleware(['attendance.access'])->group(function () {
    Route::get('attendance/my', [AttendanceController::class, 'myAttendance'])->name('attendance.my');
    Route::post('attendance/check-in', [AttendanceController::class, 'checkIn'])->name('attendance.check-in');
    Route::post('attendance/{id}/check-out', [AttendanceController::class, 'checkOut'])->name('attendance.check-out');
    Route::get('attendance/report', [AttendanceController::class, 'report'])->name('attendance.report');
    Route::resource('attendance', AttendanceController::class)->names('attendance');
});
