<?php

namespace App\Modules\HR\Organization\Department\Database\Seeders;

use App\Models\User;
use App\Modules\HR\Organization\Department\Models\Department;
use App\Modules\HR\Organization\Department\Models\DepartmentNote;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

class DepartmentNoteSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();
        $departments = Department::all();
        $users = User::all();

        foreach ($departments as $department) {
            // Create 1-3 notes per department
            $noteCount = $faker->numberBetween(1, 3);

            for ($i = 0; $i < $noteCount; $i++) {
                DepartmentNote::create([
                    'department_id' => $department->id,
                    'created_by' => $users->random()->id ?? 1,
                    'title' => $faker->sentence(3),
                    'note' => $faker->paragraph(2),
                    'category' => $faker->randomElement(['general', 'performance', 'policy', 'budget', 'strategy']),
                ]);
            }
        }
    }
}