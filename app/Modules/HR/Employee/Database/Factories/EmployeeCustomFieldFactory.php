<?php

namespace App\Modules\HR\Employee\Database\Factories;

use App\Modules\HR\Employee\Models\Employee;
use App\Modules\HR\Employee\Models\EmployeeCustomField;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EmployeeCustomField>
 */
class EmployeeCustomFieldFactory extends Factory
{
    protected $model = EmployeeCustomField::class;

    public function definition(): array
    {
        $fieldType = $this->faker->randomElement(['text', 'number', 'date', 'boolean', 'select']);

        $fieldValue = match ($fieldType) {
            'text' => $this->faker->word(),
            'number' => (string) $this->faker->numberBetween(1, 100),
            'date' => $this->faker->date(),
            'boolean' => $this->faker->boolean() ? 'true' : 'false',
            'select' => $this->faker->randomElement(['Option 1', 'Option 2', 'Option 3']),
        };

        return [
            'employee_id' => Employee::factory(),
            'field_key' => $this->faker->unique()->slug(2),
            'field_value' => $fieldValue,
            'field_type' => $fieldType,
            'section' => $this->faker->randomElement(['personal', 'professional', 'other']),
        ];
    }
}
