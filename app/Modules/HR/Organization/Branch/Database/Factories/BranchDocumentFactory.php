<?php

namespace App\Modules\HR\Organization\Branch\Database\Factories;

use App\Models\User;
use App\Modules\HR\Organization\Branch\Models\Branch;
use App\Modules\HR\Organization\Branch\Models\BranchDocument;
use Illuminate\Database\Eloquent\Factories\Factory;

class BranchDocumentFactory extends Factory
{
    protected $model = BranchDocument::class;

    public function definition(): array
    {
        return [
            'branch_id' => Branch::factory(),
            'doc_type' => $this->faker->randomElement(['license', 'contract', 'permit', 'certificate', 'report']),
            'title' => $this->faker->sentence(3),
            'file_name' => $this->faker->word().'.pdf',
            'file_path' => 'branches/documents/'.$this->faker->uuid().'.pdf',
            'file_size' => $this->faker->numberBetween(100000, 5000000),
            'mime_type' => 'application/pdf',
            'expiry_date' => $this->faker->optional()->dateTimeBetween('now', '+2 years'),
            'uploaded_by' => User::factory(),
        ];
    }

    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'expiry_date' => $this->faker->dateTimeBetween('-1 year', '-1 day'),
        ]);
    }

    public function expiringSoon(): static
    {
        return $this->state(fn (array $attributes) => [
            'expiry_date' => $this->faker->dateTimeBetween('now', '+29 days'),
        ]);
    }

    public function valid(): static
    {
        return $this->state(fn (array $attributes) => [
            'expiry_date' => $this->faker->dateTimeBetween('+31 days', '+2 years'),
        ]);
    }
}
