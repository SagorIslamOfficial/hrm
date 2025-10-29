<?php

namespace App\Modules\Attendance\Contracts;

use App\Modules\Attendance\Models\Attendance;
use Illuminate\Database\Eloquent\Collection;

interface AttendanceServiceInterface
{
    public function checkIn(int $employeeId, array $data): Attendance;

    public function checkOut(int $attendanceId, array $data): Attendance;

    public function getEmployeeAttendance(int $employeeId, ?string $month = null): Collection;

    public function calculateWorkedHours(Attendance $attendance): float;

    public function getAttendanceStats(int $employeeId, ?string $month = null): array;
}
