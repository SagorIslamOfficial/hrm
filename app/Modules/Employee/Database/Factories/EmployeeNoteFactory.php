<?php

namespace App\Modules\Employee\Database\Factories;

use App\Models\User;
use App\Modules\Employee\Models\Employee;
use App\Modules\Employee\Models\EmployeeNote;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Modules\Employee\Models\EmployeeNote>
 */
class EmployeeNoteFactory extends Factory
{
    protected $model = EmployeeNote::class;

    public function definition(): array
    {
        return [
            'employee_id' => Employee::factory(),
            'note' => $this->faker->sentences(3, true),
            'created_by' => User::factory(),
            'is_private' => $this->faker->boolean(30),
            'category' => $this->faker->randomElement(['general', 'performance', 'disciplinary', 'achievement', 'other']),
        ];
    }

    public function private(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_private' => true,
        ]);
    }
}
