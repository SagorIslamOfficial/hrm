<?php

namespace App\Modules\Department\Database\Seeders;

use App\Models\User;
use App\Modules\Department\Models\Department;
use App\Modules\Employee\Models\Employee;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            ['name' => 'Human Resources', 'code' => 'HR', 'description' => 'Manages recruitment, employee relations, and HR policies', 'budget' => 500000, 'location' => 'Floor 2', 'status' => 'active'],
            ['name' => 'Information Technology', 'code' => 'IT', 'description' => 'Handles software development, infrastructure, and technical support', 'budget' => 2500000, 'location' => 'Floor 3', 'status' => 'active'],
            ['name' => 'Finance', 'code' => 'FIN', 'description' => 'Manages accounting, budgeting, and financial planning', 'budget' => 750000, 'location' => 'Floor 1', 'status' => 'active'],
            ['name' => 'Marketing', 'code' => 'MKT', 'description' => 'Responsible for brand management and marketing campaigns', 'budget' => 1200000, 'location' => 'Floor 2', 'status' => 'active'],
            ['name' => 'Sales', 'code' => 'SAL', 'description' => 'Drives revenue through customer acquisition and retention', 'budget' => 2000000, 'location' => 'Floor 1', 'status' => 'active'],
            ['name' => 'Operations', 'code' => 'OPS', 'description' => 'Oversees day-to-day business operations', 'budget' => 1500000, 'location' => 'Floor 2', 'status' => 'active'],
            ['name' => 'Customer Service', 'code' => 'CS', 'description' => 'Provides support and assistance to customers', 'budget' => 800000, 'location' => 'Floor 4', 'status' => 'active'],
            ['name' => 'Engineering', 'code' => 'ENG', 'description' => 'Develops and maintains core products and systems', 'budget' => 3500000, 'location' => 'Floor 3', 'status' => 'active'],
            ['name' => 'Legal & Compliance', 'code' => 'LGL', 'description' => 'Handles legal matters, contracts, and regulatory compliance', 'budget' => 600000, 'location' => 'Floor 1', 'status' => 'active'],
            ['name' => 'Research & Development', 'code' => 'RND', 'description' => 'Focuses on innovation and new product development', 'budget' => 2800000, 'location' => 'Floor 3', 'status' => 'active'],
            ['name' => 'Quality Assurance', 'code' => 'QA', 'description' => 'Ensures product and service quality standards', 'budget' => 900000, 'location' => 'Floor 3', 'status' => 'active'],
            ['name' => 'Business Development', 'code' => 'BD', 'description' => 'Identifies growth opportunities and partnership strategies', 'budget' => 1100000, 'location' => 'Floor 2', 'status' => 'active'],
        ];

        $employees = Employee::all();
        $users = User::all();

        foreach ($departments as $dept) {
            $department = Department::firstOrCreate(
                ['code' => $dept['code']],
                [
                    'name' => $dept['name'],
                    'description' => $dept['description'],
                    'budget' => $dept['budget'],
                    'location' => $dept['location'],
                    'status' => $dept['status'],
                    'is_active' => true,
                    'manager_id' => $employees->count() > 0 ? $employees->random()->id : null,
                ]
            );

            // Create detail and settings for each department
            $department->detail()->firstOrCreate(
                ['department_id' => $department->id],
                [
                    'founded_date' => fake()->dateTimeBetween('-10 years', 'now'),
                    'division' => fake()->randomElement(['Corporate', 'Regional', 'Local']),
                    'cost_center' => fake()->numerify('CC-#####'),
                    'internal_code' => fake()->unique()->bothify('??-####'),
                    'office_phone' => fake()->phoneNumber(),
                ]
            );

            $department->notes()->firstOrCreate(
                ['department_id' => $department->id],
                [
                    'title' => 'Initial Note for '.$department->name,
                    'note' => 'This is a seeded note for the '.$department->name.' department.',
                    'category' => 'general',
                    'created_by' => $users->count() > 0 ? $users->random()->id : null,
                    'updated_by' => $users->count() > 0 ? $users->random()->id : null,
                ]
            );

            $department->settings()->firstOrCreate(
                ['department_id' => $department->id],
                [
                    'overtime_allowed' => fake()->boolean(80),
                    'travel_allowed' => fake()->boolean(70),
                    'home_office_allowed' => fake()->boolean(60),
                    'meeting_room_count' => fake()->numberBetween(2, 8),
                    'desk_count' => fake()->numberBetween(10, 50),
                    'requires_approval' => fake()->boolean(50),
                    'approval_level' => fake()->randomElement(['Manager', 'Director', 'Head']),
                ]
            );
        }
    }
}
