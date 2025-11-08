<?php

namespace App\Modules\Attendance\Database\Factories;

use App\Modules\Attendance\Models\Attendance;
use App\Modules\HR\Employee\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class AttendanceFactory extends Factory
{
    protected $model = Attendance::class;

    public function definition(): array
    {
        $checkIn = $this->faker->dateTimeBetween('-1 month', 'now');
        $checkOut = $this->faker->dateTimeBetween($checkIn, $checkIn->format('Y-m-d H:i:s').' +8 hours');

        return [
            'employee_id' => Employee::factory(),
            'date' => $checkIn->format('Y-m-d'),
            'check_in' => $this->faker->boolean(90) ? $checkIn->format('H:i:s') : null,
            'check_out' => $this->faker->boolean(80) ? $checkOut->format('H:i:s') : null,
            'status' => $this->faker->randomElement(['present', 'absent', 'late', 'leave', 'half_day']),
            'remarks' => $this->faker->optional(0.3)->sentence(),
        ];
    }
}
