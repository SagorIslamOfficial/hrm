<?php

namespace App\Modules\Employee\Database\Factories;

use App\Modules\Employee\Models\Employee;
use App\Modules\Employee\Models\EmployeeContact;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EmployeeContact>
 */
class EmployeeContactFactory extends Factory
{
    protected $model = EmployeeContact::class;

    public function definition(): array
    {
        return [
            'employee_id' => Employee::factory(),
            'contact_name' => $this->faker->name(),
            'relationship' => $this->faker->randomElement(['spouse', 'parent', 'sibling', 'friend', 'other']),
            'phone' => $this->faker->phoneNumber(),
            'email' => $this->faker->optional()->safeEmail(),
            'address' => $this->faker->address(),
            'is_primary' => false,
        ];
    }

    public function primary(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_primary' => true,
        ]);
    }
}
