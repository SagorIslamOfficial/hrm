<?php

namespace App\Modules\Employee\Database\Factories;

use App\Modules\Employee\Models\Employee;
use App\Modules\Employee\Models\EmployeeJobDetail;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EmployeeJobDetail>
 */
class EmployeeJobDetailFactory extends Factory
{
    protected $model = EmployeeJobDetail::class;

    public function definition(): array
    {
        $hasProbation = $this->faker->boolean(60);
        $hasContract = $this->faker->boolean(30);

        return [
            'employee_id' => Employee::factory(),
            'job_title' => $this->faker->jobTitle(),
            'employment_type' => $this->faker->randomElement(['permanent', 'contract', 'intern', 'part_time']),
            'supervisor_id' => null, // Can be set manually or via state
            'work_shift' => $this->faker->randomElement(['day', 'night', 'rotating', 'flexible']),
            'probation_end_date' => $hasProbation ? $this->faker->dateTimeBetween('now', '+6 months') : null,
            'contract_end_date' => $hasContract ? $this->faker->dateTimeBetween('+6 months', '+3 years') : null,
        ];
    }

    public function withSupervisor(): static
    {
        return $this->state(fn (array $attributes) => [
            'supervisor_id' => Employee::factory(),
        ]);
    }
}
