<?php

namespace App\Modules\Employee\Database\Factories;

use App\Models\User;
use App\Modules\Employee\Models\Employee;
use App\Modules\Employee\Models\EmployeeLeave;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EmployeeLeave>
 */
class EmployeeLeaveFactory extends Factory
{
    protected $model = EmployeeLeave::class;

    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('-60 days', '+30 days');
        $endDate = $this->faker->dateTimeBetween($startDate, '+7 days');
        $totalDays = $startDate->diff($endDate)->days + 1;

        return [
            'employee_id' => Employee::factory(),
            'leave_type' => $this->faker->randomElement(['casual', 'sick', 'annual', 'maternity', 'paternity', 'unpaid']),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'total_days' => $totalDays,
            'status' => $this->faker->randomElement(['pending', 'approved', 'rejected', 'cancelled']),
            'reason' => $this->faker->sentence(),
            'approved_by' => $this->faker->boolean(70) ? User::factory() : null,
            'approved_at' => $this->faker->optional(0.7)->dateTimeBetween($startDate, 'now'),
        ];
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
            'approved_by' => User::factory(),
            'approved_at' => now(),
        ]);
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'approved_by' => null,
            'approved_at' => null,
        ]);
    }
}
