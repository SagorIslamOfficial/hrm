<?php

namespace App\Modules\HR\Organization\Department\Database\Factories;

use App\Models\User;
use App\Modules\HR\Organization\Department\Models\Department;
use App\Modules\HR\Organization\Department\Models\DepartmentNote;
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
            'updated_by' => null,
            'title' => $this->faker->optional()->sentence(3),
            'note' => $this->faker->sentences(3, true),
            'category' => $this->faker->randomElement(['general', 'policy', 'announcement', 'achievement', 'other']),
        ];
    }
}
