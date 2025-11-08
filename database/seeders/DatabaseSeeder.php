<?php

namespace Database\Seeders;

use App\Models\User;
use App\Modules\HR\Employee\Database\Seeders\EmployeeSeeder;
use App\Modules\HR\Employee\Database\Seeders\EmploymentTypeSeeder;
use App\Modules\HR\Organization\Department\Database\Seeders\DepartmentSeeder;
use App\Modules\HR\Organization\Department\Database\Seeders\DesignationSeeder;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
        ]);

        // Create admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@sagorislam.dev'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $admin->assignRole('Admin');

        // Create test user (existing)
        User::firstOrCreate(
            ['email' => 'test@sagorislam.dev'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Seed departments and designations first
        $this->call([
            DepartmentSeeder::class,
            DesignationSeeder::class,
        ]);

        // Seed employees with all related data
        $this->call([
            EmploymentTypeSeeder::class,
            EmployeeSeeder::class,
        ]);
    }
}
