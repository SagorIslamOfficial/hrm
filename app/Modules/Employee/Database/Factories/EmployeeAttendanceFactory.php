<?php

namespace App\Modules\Employee\Database\Factories;

use App\Modules\Employee\Models\Employee;
use App\Modules\Employee\Models\EmployeeAttendance;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EmployeeAttendance>
 */
class EmployeeAttendanceFactory extends Factory
{
    protected $model = EmployeeAttendance::class;

    public function definition(): array
    {
        $date = $this->faker->dateTimeBetween('-30 days', 'now');
        $checkIn = $this->faker->dateTimeBetween($date->format('Y-m-d').' 08:00:00', $date->format('Y-m-d').' 09:30:00');
        $checkOut = $this->faker->optional(0.9)->dateTimeBetween($checkIn->format('Y-m-d H:i:s'), $date->format('Y-m-d').' 18:00:00');

        return [
            'employee_id' => Employee::factory(),
            'date' => $date,
            'check_in' => $checkIn,
            'check_out' => $checkOut,
            'status' => $this->faker->randomElement(['present', 'absent', 'half_day', 'late', 'leave']),
            'remarks' => $this->faker->optional()->sentence(),
        ];
    }
}
