<?php

namespace App\Modules\HR\Organization\Department\Database\Factories;

use App\Modules\HR\Organization\Department\Models\Department;
use App\Modules\HR\Organization\Department\Models\DepartmentSettings;
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
            'overtime_allowed' => $this->faker->boolean(70),
            'travel_allowed' => $this->faker->boolean(60),
            'home_office_allowed' => $this->faker->boolean(80),
            'meeting_room_count' => $this->faker->numberBetween(1, 10),
            'desk_count' => $this->faker->numberBetween(5, 50),
            'requires_approval' => $this->faker->boolean(50),
            'approval_level' => $this->faker->randomElement(['manager', 'director', 'ceo']),
        ];
    }
}
