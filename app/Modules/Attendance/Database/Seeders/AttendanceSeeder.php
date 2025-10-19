<?php

namespace App\Modules\Attendance\Database\Seeders;

use App\Modules\Attendance\Models\Attendance;
use App\Modules\Employee\Models\Employee;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employees = Employee::all();

        if ($employees->isEmpty()) {
            return; // No employees to create attendance for
        }

        // Create attendance records for the last 30 days
        $endDate = Carbon::now();
        $startDate = Carbon::now()->subDays(30);

        for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
            // Skip weekends (Saturday = 6, Sunday = 0)
            if ($date->dayOfWeek === 0 || $date->dayOfWeek === 6) {
                continue;
            }

            foreach ($employees as $employee) {
                // 90% chance of being present
                if (fake()->boolean(90)) {
                    $this->createAttendanceRecord($employee, $date->copy());
                }
            }
        }
    }

    /**
     * Create a single attendance record for an employee on a specific date.
     */
    private function createAttendanceRecord(Employee $employee, Carbon $date): void
    {
        // Standard work hours: 9 AM - 5 PM
        $checkInTime = $date->copy()->setHour(9)->setMinute(0)->setSecond(0);
        $checkOutTime = $date->copy()->setHour(17)->setMinute(0)->setSecond(0);

        // Add some variation to check-in times (±30 minutes)
        $checkInVariation = fake()->numberBetween(-30, 30);
        $checkInTime->addMinutes($checkInVariation);

        // Add some variation to check-out times (±30 minutes)
        $checkOutVariation = fake()->numberBetween(-30, 30);
        $checkOutTime->addMinutes($checkOutVariation);

        // Determine status based on check-in time
        $status = 'present';
        if ($checkInTime->format('H:i') > '09:15') {
            $status = 'late';
        }

        // Calculate worked hours
        $workedHours = $checkInTime->diffInMinutes($checkOutTime) / 60;

        // Sometimes employees might not check out (80% chance they do)
        $actualCheckOutTime = fake()->boolean(80) ? $checkOutTime : null;
        $actualWorkedHours = $actualCheckOutTime ? $workedHours : null;

        Attendance::create([
            'employee_id' => $employee->id,
            'date' => $date->format('Y-m-d'),
            'check_in_time' => $checkInTime,
            'check_out_time' => $actualCheckOutTime,
            'status' => $status,
            'notes' => fake()->optional(0.2)->sentence(),
            'worked_hours' => $actualWorkedHours,
        ]);
    }
}
