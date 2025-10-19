<?php

namespace App\Modules\Employee\Database\Seeders;

use App\Modules\Employee\Models\EmploymentType;
use Illuminate\Database\Seeder;

class EmploymentTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employmentTypes = [
            [
                'name' => 'Permanent',
                'code' => 'permanent',
                'description' => 'Full-time permanent employee position',
                'is_active' => true,
            ],
            [
                'name' => 'Contract',
                'code' => 'contract',
                'description' => 'Fixed-term contract employee position',
                'is_active' => true,
            ],
            [
                'name' => 'Intern',
                'code' => 'intern',
                'description' => 'Internship or trainee position',
                'is_active' => true,
            ],
            [
                'name' => 'Part Time',
                'code' => 'part_time',
                'description' => 'Part-time employee position',
                'is_active' => true,
            ],
            [
                'name' => 'Freelance',
                'code' => 'freelance',
                'description' => 'Freelance or independent contractor',
                'is_active' => false,
            ],
            [
                'name' => 'Consultant',
                'code' => 'consultant',
                'description' => 'External consultant or advisor',
                'is_active' => false,
            ],
        ];

        foreach ($employmentTypes as $type) {
            EmploymentType::firstOrCreate(
                ['code' => $type['code']],
                $type
            );
        }
    }
}
