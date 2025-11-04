<?php

namespace App\Modules\Department\Database\Factories;

use App\Models\User;
use App\Modules\Department\Models\Department;
use App\Modules\Department\Models\DepartmentNote;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DepartmentNote>
 */
class DepartmentNoteFactory extends Factory
{
    protected $model = DepartmentNote::class;

    public function definition(): array
    {
        return [
            'department_id' => Department::factory(),
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
            'title' => $this->faker->optional(0.7)->sentence(4),
            'note' => $this->faker->paragraphs(3, true),
            'category' => $this->faker->randomElement(['general', 'performance', 'disciplinary', 'achievement', 'other']),
        ];
    }

    public function general(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'general',
        ]);
    }

    public function performance(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'performance',
        ]);
    }

    public function disciplinary(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'disciplinary',
        ]);
    }
}
