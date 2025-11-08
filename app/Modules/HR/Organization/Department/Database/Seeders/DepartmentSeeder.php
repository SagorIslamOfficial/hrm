<?php

namespace App\Modules\HR\Organization\Department\Database\Seeders;

use App\Modules\HR\Organization\Department\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            ['name' => 'Human Resources', 'code' => 'HR', 'description' => 'Manages recruitment, employee relations, and HR policies'],
            ['name' => 'Information Technology', 'code' => 'IT', 'description' => 'Handles software development, infrastructure, and technical support'],
            ['name' => 'Finance', 'code' => 'FIN', 'description' => 'Manages accounting, budgeting, and financial planning'],
            ['name' => 'Marketing', 'code' => 'MKT', 'description' => 'Responsible for brand management and marketing campaigns'],
            ['name' => 'Sales', 'code' => 'SAL', 'description' => 'Drives revenue through customer acquisition and retention'],
            ['name' => 'Operations', 'code' => 'OPS', 'description' => 'Oversees day-to-day business operations'],
            ['name' => 'Customer Service', 'code' => 'CS', 'description' => 'Provides support and assistance to customers'],
            ['name' => 'Engineering', 'code' => 'ENG', 'description' => 'Develops and maintains core products and systems'],
        ];

        foreach ($departments as $dept) {
            Department::firstOrCreate(
                ['code' => $dept['code']],
                [
                    'name' => $dept['name'],
                    'description' => $dept['description'],
                    'is_active' => true,
                ]
            );
        }
    }
}
