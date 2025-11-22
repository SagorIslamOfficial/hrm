<?php

namespace App\Modules\HR\Organization\Branch\Database\Factories;

use App\Modules\HR\Organization\Branch\Models\Branch;
use App\Modules\HR\Organization\Branch\Models\BranchCustomField;
use Illuminate\Database\Eloquent\Factories\Factory;

class BranchCustomFieldFactory extends Factory
{
    protected $model = BranchCustomField::class;

    public function definition(): array
    {
        return [
            'branch_id' => Branch::factory(),
            'field_key' => $this->faker->unique()->slug(2),
            'field_value' => $this->faker->sentence(3),
            'field_type' => $this->faker->randomElement(['text', 'number', 'date', 'boolean', 'email', 'phone', 'url', 'textarea']),
            'section' => $this->faker->randomElement(['general', 'operational', 'technical', 'other']),
        ];
    }

    public function general(): static
    {
        return $this->state(fn (array $attributes) => [
            'section' => 'general',
        ]);
    }

    public function operational(): static
    {
        return $this->state(fn (array $attributes) => [
            'section' => 'operational',
        ]);
    }

    public function technical(): static
    {
        return $this->state(fn (array $attributes) => [
            'section' => 'technical',
        ]);
    }

    public function other(): static
    {
        return $this->state(fn (array $attributes) => [
            'section' => 'other',
        ]);
    }
}
