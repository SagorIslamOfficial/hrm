<?php

namespace App\Modules\Attendance\Services;

use App\Modules\Attendance\Contracts\AttendanceRepositoryInterface;
use App\Modules\Attendance\Contracts\AttendanceServiceInterface;
use App\Modules\Attendance\Models\Attendance;
use Illuminate\Database\Eloquent\Collection;

class AttendanceService implements AttendanceServiceInterface
{
    public function __construct(
        private AttendanceRepositoryInterface $attendanceRepository
    ) {}

    public function checkIn(int $employeeId, array $data): Attendance
    {
        $date = $data['date'] ?? now()->toDateString();

        // Check if already checked in today
        $existing = $this->attendanceRepository->findByEmployeeAndDate($employeeId, $date);
        if ($existing && $existing->check_in_time) {
            throw new \Exception('Already checked in for today');
        }

        $attendanceData = [
            'employee_id' => $employeeId,
            'date' => $date,
            'check_in_time' => $data['check_in_time'] ?? now(),
            'status' => 'present',
        ];

        if ($existing) {
            $this->attendanceRepository->update($existing, $attendanceData);

            return $existing->fresh();
        }

        return $this->attendanceRepository->create($attendanceData);
    }

    public function checkOut(int $attendanceId, array $data): Attendance
    {
        $attendance = $this->attendanceRepository->findById($attendanceId);

        if (! $attendance->check_in_time) {
            throw new \Exception('Cannot check out without check in');
        }

        $checkOutTime = $data['check_out_time'] ?? now();

        $this->attendanceRepository->update($attendance, [
            'check_out_time' => $checkOutTime,
            'worked_hours' => $this->calculateWorkedHours($attendance->fresh()),
        ]);

        return $attendance->fresh();
    }

    public function getEmployeeAttendance(int $employeeId, ?string $month = null): Collection
    {
        return $this->attendanceRepository->getEmployeeAttendance($employeeId, $month);
    }

    public function calculateWorkedHours(Attendance $attendance): float
    {
        if (! $attendance->check_in_time || ! $attendance->check_out_time) {
            return 0;
        }

        $hours = $attendance->check_in_time->diffInHours($attendance->check_out_time);
        $minutes = $attendance->check_in_time->diffInMinutes($attendance->check_out_time) % 60;

        return round($hours + ($minutes / 60), 2);
    }

    public function getAttendanceStats(int $employeeId, ?string $month = null): array
    {
        $attendances = $this->getEmployeeAttendance($employeeId, $month);

        $totalDays = $attendances->count();
        $presentDays = $attendances->where('status', 'present')->count();
        $absentDays = $attendances->where('status', 'absent')->count();
        $lateDays = $attendances->where('is_late', true)->count();

        $totalHours = $attendances->sum('worked_hours');

        return [
            'total_days' => $totalDays,
            'present_days' => $presentDays,
            'absent_days' => $absentDays,
            'late_days' => $lateDays,
            'total_hours' => $totalHours,
            'attendance_percentage' => $totalDays > 0 ? round(($presentDays / $totalDays) * 100, 2) : 0,
        ];
    }
}
