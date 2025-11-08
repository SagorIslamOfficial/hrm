<?php

namespace App\Modules\HR\Employee\Database\Factories;

use App\Modules\HR\Employee\Models\Employee;
use App\Modules\HR\Employee\Models\EmployeePersonalDetail;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EmployeePersonalDetail>
 */
class EmployeePersonalDetailFactory extends Factory
{
    protected $model = EmployeePersonalDetail::class;

    public function definition(): array
    {
        return [
            'employee_id' => Employee::factory(),
            'date_of_birth' => $this->faker->dateTimeBetween('-60 years', '-20 years'),
            'gender' => $this->faker->randomElement(['male', 'female', 'other']),
            'marital_status' => $this->faker->randomElement(['single', 'married', 'divorced', 'widowed']),
            'blood_group' => $this->faker->randomElement(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
            'national_id' => $this->faker->numerify('##########'),
            'passport_number' => $this->faker->optional()->bothify('??######'),
            'address' => $this->faker->address(),
            'city' => $this->faker->city(),
            'country' => $this->faker->country(),
        ];
    }
}
