<?php

namespace App\Modules\HR\Organization\Branch\Database\Factories;

use App\Modules\HR\Organization\Branch\Models\Branch;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Branch>
 */
class BranchFactory extends Factory
{
    protected $model = Branch::class;

    public function definition(): array
    {
        $branchNames = [
            'Headquarters',
            'North Region',
            'South Region',
            'East Region',
            'West Region',
            'Central Branch',
            'Downtown Office',
            'Uptown Office',
            'Suburban Branch',
            'Industrial Park',
            'Tech Hub',
            'Innovation Center',
            'Distribution Center',
            'Sales Office',
            'Service Center',
        ];

        $cities = [
            'Dhaka',
            'Chittagong',
            'Sylhet',
            'Rajshahi',
            'Khulna',
            'Barisal',
            'Rangpur',
            'Mymensingh',
        ];

        $types = [
            'head_office',
            'regional_office',
            'branch_office',
            'sub_branch',
            'warehouse',
            'sales_office',
            'service_center',
        ];

        $city = fake()->randomElement($cities);

        return [
            'name' => fake()->randomElement($branchNames),
            'code' => fake()->unique()->regexify('[A-Z]{2}[0-9]{3}'),
            'type' => fake()->randomElement($types),
            'description' => fake()->sentence(),
            'parent_id' => null,
            'manager_id' => null,
            'address_line_1' => fake()->streetAddress(),
            'address_line_2' => fake()->optional()->secondaryAddress(),
            'city' => $city,
            'state' => fake()->optional()->state(),
            'country' => 'Bangladesh',
            'postal_code' => fake()->postcode(),
            'timezone' => 'Asia/Dhaka',
            'phone' => fake()->phoneNumber(),
            'phone_2' => fake()->optional()->phoneNumber(),
            'email' => fake()->unique()->companyEmail(),
            'opening_date' => fake()->dateTimeBetween('-5 years', 'now'),
            'is_active' => true,
            'status' => 'active',
            'max_employees' => fake()->numberBetween(20, 500),
            'budget' => fake()->randomFloat(2, 100000, 10000000),
            'cost_center' => fake()->optional()->regexify('CC-[0-9]{4}'),
            'tax_registration_number' => fake()->optional()->numerify('TIN-###########'),
        ];
    }
}
