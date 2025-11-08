<?php

namespace App\Modules\HR\Organization\Department\Database\Factories;

use App\Modules\HR\Organization\Department\Models\Department;
use App\Modules\HR\Organization\Department\Models\Designation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Designation>
 */
class DesignationFactory extends Factory
{
    protected $model = Designation::class;

    public function definition(): array
    {
        $designations = [
            'Manager',
            'Senior Developer',
            'Junior Developer',
            'Team Lead',
            'Executive',
            'Analyst',
            'Specialist',
            'Coordinator',
            'Associate',
            'Intern',
        ];

        return [
            'title' => $this->faker->randomElement($designations),
            'code' => strtoupper($this->faker->unique()->bothify('DES-###')),
            'description' => $this->faker->optional()->sentence(),
            'department_id' => Department::factory(),
            'is_active' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
