<?php

namespace App\Modules\HR\Employee\Database\Factories;

use App\Modules\HR\Employee\Models\Employee;
use App\Modules\HR\Organization\Department\Models\Department;
use App\Modules\HR\Organization\Department\Models\Designation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Employee>
 */
class EmployeeFactory extends Factory
{
    protected $model = Employee::class;

    public function definition(): array
    {
        return [
            'employee_code' => $this->faker->unique()->numerify('EMP-#####'),
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'photo' => null,
            'department_id' => Department::factory(),
            'designation_id' => Designation::factory(),
            'employment_status' => $this->faker->randomElement(['active', 'inactive', 'terminated', 'on_leave']),
            'employment_type' => $this->faker->randomElement(['permanent', 'contract', 'intern', 'part_time']),
            'joining_date' => $this->faker->dateTimeBetween('-5 years', 'now'),
        ];
    }
}
