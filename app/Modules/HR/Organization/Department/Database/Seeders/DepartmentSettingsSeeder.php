<?php

namespace App\Modules\HR\Organization\Department\Database\Seeders;

use App\Modules\HR\Organization\Department\Models\Department;
use App\Modules\HR\Organization\Department\Models\DepartmentSettings;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

class DepartmentSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();
        $departments = Department::all();

        foreach ($departments as $department) {
            DepartmentSettings::firstOrCreate(
                ['department_id' => $department->id],
                [
                    'overtime_allowed' => $faker->boolean(80), // 80% chance of allowing overtime
                    'travel_allowed' => $faker->boolean(70), // 70% chance of allowing travel
                    'home_office_allowed' => $faker->boolean(60), // 60% chance of allowing home office
                    'meeting_room_count' => $faker->numberBetween(0, 5),
                    'desk_count' => $faker->numberBetween(5, 50),
                    'requires_approval' => $faker->boolean(40), // 40% chance of requiring approval
                    'approval_level' => $faker->randomElement(['manager', 'director', 'vp', 'ceo', null]),
                ]
            );
        }
    }
}
