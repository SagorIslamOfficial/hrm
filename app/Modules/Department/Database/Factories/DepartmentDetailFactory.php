<?php

namespace App\Modules\Department\Database\Factories;

use App\Modules\Department\Models\Department;
use App\Modules\Department\Models\DepartmentDetail;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DepartmentDetail>
 */
class DepartmentDetailFactory extends Factory
{
    protected $model = DepartmentDetail::class;

    public function definition(): array
    {
        return [
            'department_id' => Department::factory(),
            'founded_date' => $this->faker->dateTimeBetween('-10 years', 'now'),
            'division' => $this->faker->optional()->randomElement(['Division A', 'Division B', 'Division C', 'Corporate']),
            'cost_center' => $this->faker->numerify('CC-#####'),
            'internal_code' => $this->faker->unique()->bothify('??-####'),
            'office_phone' => $this->faker->phoneNumber(),
        ];
    }
}
