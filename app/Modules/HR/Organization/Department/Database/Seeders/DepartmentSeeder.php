<?php

namespace App\Modules\HR\Organization\Department\Database\Seeders;

use App\Modules\HR\Organization\Department\Models\Department;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $departments = [
            ['name' => 'Human Resources', 'code' => 'HR', 'description' => 'Manages recruitment, employee relations, and HR policies', 'budget' => $faker->randomFloat(2, 10000, 1000000), 'location' => $faker->city()],
            ['name' => 'Information Technology', 'code' => 'IT', 'description' => 'Handles software development, infrastructure, and technical support', 'budget' => $faker->randomFloat(2, 10000, 1000000), 'location' => $faker->city()],
            ['name' => 'Finance', 'code' => 'FIN', 'description' => 'Manages accounting, budgeting, and financial planning', 'budget' => $faker->randomFloat(2, 10000, 1000000), 'location' => $faker->city()],
            ['name' => 'Marketing', 'code' => 'MKT', 'description' => 'Responsible for brand management and marketing campaigns', 'budget' => $faker->randomFloat(2, 10000, 1000000), 'location' => $faker->city()],
            ['name' => 'Sales', 'code' => 'SAL', 'description' => 'Drives revenue through customer acquisition and retention', 'budget' => $faker->randomFloat(2, 10000, 1000000), 'location' => $faker->city()],
            ['name' => 'Operations', 'code' => 'OPS', 'description' => 'Oversees day-to-day business operations', 'budget' => $faker->randomFloat(2, 10000, 1000000), 'location' => $faker->city()],
            ['name' => 'Customer Service', 'code' => 'CS', 'description' => 'Provides support and assistance to customers', 'budget' => $faker->randomFloat(2, 10000, 1000000), 'location' => $faker->city()],
            ['name' => 'Engineering', 'code' => 'ENG', 'description' => 'Develops and maintains core products and systems', 'budget' => $faker->randomFloat(2, 10000, 1000000), 'location' => $faker->city()],
        ];

        foreach ($departments as $dept) {
            Department::firstOrCreate(
                ['code' => $dept['code']],
                [
                    'name' => $dept['name'],
                    'description' => $dept['description'],
                    'budget' => $dept['budget'],
                    'location' => $dept['location'],
                    'is_active' => true,
                ]
            );
        }
    }
}
