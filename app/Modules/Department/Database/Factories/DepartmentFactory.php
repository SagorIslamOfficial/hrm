<?php

namespace App\Modules\Department\Database\Factories;

use App\Modules\Department\Models\Department;
use App\Modules\Employee\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Department>
 */
class DepartmentFactory extends Factory
{
    protected $model = Department::class;

    public function definition(): array
    {
        $departments = [
            'Human Resources',
            'Information Technology',
            'Finance',
            'Marketing',
            'Sales',
            'Operations',
            'Customer Service',
            'Engineering',
            'Research & Development',
            'Quality Assurance',
            'Legal',
            'Procurement',
            'Administration',
            'Training',
            'Security',
        ];

        return [
            'name' => fake()->randomElement($departments),
            'code' => fake()->unique()->lexify('???'),
            'description' => fake()->sentence(),
            'manager_id' => null,
            'is_active' => true,
            'budget' => fake()->randomFloat(2, 0, 100000),
            'location' => fake()->city(),
            'status' => 'active',
        ];
    }

    public function withManager(): static
    {
        return $this->state(fn (array $attributes) => [
            'manager_id' => Employee::factory(),
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
