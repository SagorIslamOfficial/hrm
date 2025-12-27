<?php

namespace App\Modules\HR\Organization\Department\Database\Seeders;

use App\Modules\HR\Organization\Department\Models\Department;
use App\Modules\HR\Organization\Department\Models\DepartmentDetail;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

class DepartmentDetailSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();
        $departments = Department::all();

        foreach ($departments as $department) {
            DepartmentDetail::firstOrCreate(
                ['department_id' => $department->id],
                [
                    'founded_date' => $faker->dateTimeBetween('-10 years', 'now'),
                    'division' => $faker->randomElement(['Corporate', 'Operations', 'Support', 'Development', 'Sales']),
                    'cost_center' => $faker->numerify('CC-####'),
                    'internal_code' => $faker->bothify('??-####'),
                    'office_phone' => $faker->phoneNumber(),
                ]
            );
        }
    }
}
