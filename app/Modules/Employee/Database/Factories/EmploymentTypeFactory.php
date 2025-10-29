<?php

namespace App\Modules\Employee\Database\Factories;

use App\Modules\Employee\Models\EmploymentType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EmploymentType>
 */
class EmploymentTypeFactory extends Factory
{
    protected $model = EmploymentType::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = [
            ['name' => 'Permanent', 'code' => 'permanent'],
            ['name' => 'Contract', 'code' => 'contract'],
            ['name' => 'Intern', 'code' => 'intern'],
            ['name' => 'Part Time', 'code' => 'part_time'],
            ['name' => 'Freelance', 'code' => 'freelance'],
            ['name' => 'Consultant', 'code' => 'consultant'],
        ];

        $type = $this->faker->randomElement($types);

        return [
            'name' => $type['name'],
            'code' => $type['code'],
            'description' => $this->faker->sentence(),
            'is_active' => $this->faker->boolean(90), // 90% chance of being active
        ];
    }

    /**
     * Indicate that the employment type is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    /**
     * Indicate that the employment type is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
