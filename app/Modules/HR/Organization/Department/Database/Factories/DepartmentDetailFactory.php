<?php

namespace App\Modules\HR\Organization\Department\Database\Factories;

use App\Modules\HR\Organization\Department\Models\Department;
use App\Modules\HR\Organization\Department\Models\DepartmentDetail;
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
            'founded_date' => $this->faker->dateTimeBetween('-20 years', 'now'),
            'division' => $this->faker->optional()->word(),
            'cost_center' => $this->faker->unique()->bothify('CC-###'),
            'internal_code' => $this->faker->unique()->bothify('IC-###'),
            'office_phone' => $this->faker->phoneNumber(),
        ];
    }
}
