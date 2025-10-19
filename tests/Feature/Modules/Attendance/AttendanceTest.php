<?php

use App\Modules\Attendance\Database\Factories\AttendanceFactory;
use App\Modules\Attendance\Models\Attendance;
use App\Modules\Employee\Models\Employee;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('can create an attendance record', function () {
    $attendance = AttendanceFactory::new()->create();

    expect($attendance)->toBeInstanceOf(Attendance::class);
    expect($attendance->employee)->toBeInstanceOf(Employee::class);
    expect($attendance->date)->toBeInstanceOf(Carbon::class);
});

it('can check in an employee', function () {
    $employee = Employee::factory()->create();
    $checkInTime = now();

    $attendance = Attendance::create([
        'employee_id' => $employee->id,
        'date' => $checkInTime->toDateString(),
        'check_in' => $checkInTime->format('H:i:s'),
        'status' => 'present',
    ]);

    expect($attendance->check_in)->not->toBeNull();
    expect($attendance->status)->toBe('present');
});

it('can check out an employee', function () {
    $employee = Employee::factory()->create();
    $checkInTime = Carbon::createFromTime(9, 0, 0); // 9:00 AM
    $checkOutTime = Carbon::createFromTime(17, 0, 0); // 5:00 PM

    $attendance = Attendance::create([
        'employee_id' => $employee->id,
        'date' => now()->toDateString(),
        'check_in' => $checkInTime->format('H:i:s'),
        'check_out' => $checkOutTime->format('H:i:s'),
        'status' => 'present',
    ]);

    expect($attendance->check_out)->not->toBeNull();
    expect($attendance->worked_hours)->toBe(8.0);
});

it('calculates worked hours correctly', function () {
    $employee = Employee::factory()->create();
    $checkInTime = Carbon::createFromTime(9, 0, 0); // 9:00 AM
    $checkOutTime = Carbon::createFromTime(17, 0, 0); // 5:00 PM

    $attendance = new Attendance([
        'employee_id' => $employee->id,
        'date' => now()->toDateString(),
        'check_in' => $checkInTime->format('H:i:s'),
        'check_out' => $checkOutTime->format('H:i:s'),
        'status' => 'present',
    ]);

    expect($attendance->worked_hours)->toBe(8.0);
});

it('detects late check-ins', function () {
    $employee = Employee::factory()->create();
    $lateCheckIn = Carbon::createFromTime(9, 30, 0); // 9:30 AM (late)

    $attendance = Attendance::create([
        'employee_id' => $employee->id,
        'date' => now()->toDateString(),
        'check_in' => $lateCheckIn->format('H:i:s'),
        'status' => 'late',
    ]);

    expect($attendance->is_late)->toBeTrue();
});

it('detects early departures', function () {
    $employee = Employee::factory()->create();
    $checkInTime = Carbon::createFromTime(9, 0, 0);
    $earlyCheckOut = Carbon::createFromTime(16, 0, 0); // 4:00 PM (early)

    $attendance = Attendance::create([
        'employee_id' => $employee->id,
        'date' => now()->toDateString(),
        'check_in' => $checkInTime->format('H:i:s'),
        'check_out' => $earlyCheckOut->format('H:i:s'),
        'status' => 'present',
    ]);

    expect($attendance->is_early_departure)->toBeTrue();
});

it('belongs to an employee', function () {
    $attendance = AttendanceFactory::new()->create();

    expect($attendance->employee)->toBeInstanceOf(Employee::class);
    expect($attendance->employee->id)->toBe($attendance->employee_id);
});
