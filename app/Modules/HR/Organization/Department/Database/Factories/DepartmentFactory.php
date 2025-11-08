<?php

namespace App\Modules\HR\Organization\Department\Database\Factories;

use App\Modules\HR\Employee\Models\Employee;
use App\Modules\HR\Organization\Department\Models\Department;
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
