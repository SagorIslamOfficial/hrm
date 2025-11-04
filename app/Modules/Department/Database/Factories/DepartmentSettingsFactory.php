<?php

namespace App\Modules\Department\Database\Factories;

use App\Modules\Department\Models\Department;
use App\Modules\Department\Models\DepartmentSettings;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DepartmentSettings>
 */
class DepartmentSettingsFactory extends Factory
{
    protected $model = DepartmentSettings::class;

    public function definition(): array
    {
        return [
            'department_id' => Department::factory(),
            'overtime_allowed' => $this->faker->boolean(80),
            'travel_allowed' => $this->faker->boolean(70),
            'home_office_allowed' => $this->faker->boolean(60),
            'meeting_room_count' => $this->faker->numberBetween(1, 10),
            'desk_count' => $this->faker->numberBetween(5, 50),
            'requires_approval' => $this->faker->boolean(50),
            'approval_level' => $this->faker->randomElement(['Manager', 'Director', 'Head', 'C-Level']),
        ];
    }
}
