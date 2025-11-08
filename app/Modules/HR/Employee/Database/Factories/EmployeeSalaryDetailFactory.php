<?php

namespace App\Modules\HR\Employee\Database\Factories;

use App\Modules\HR\Employee\Models\Employee;
use App\Modules\HR\Employee\Models\EmployeeSalaryDetail;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EmployeeSalaryDetail>
 */
class EmployeeSalaryDetailFactory extends Factory
{
    protected $model = EmployeeSalaryDetail::class;

    public function definition(): array
    {
        $basicSalary = $this->faker->randomFloat(2, 30000, 150000);
        $allowances = $this->faker->randomFloat(2, 5000, 30000);
        $deductions = $this->faker->randomFloat(2, 2000, 15000);
        $netSalary = $basicSalary + $allowances - $deductions;

        return [
            'employee_id' => Employee::factory(),
            'basic_salary' => $basicSalary,
            'allowances' => $allowances,
            'deductions' => $deductions,
            'net_salary' => $netSalary,
            'bank_name' => $this->faker->company().' Bank',
            'bank_account_number' => $this->faker->bankAccountNumber(),
            'bank_branch' => $this->faker->city().' Branch',
            'tax_id' => $this->faker->numerify('TIN-########'),
        ];
    }
}
