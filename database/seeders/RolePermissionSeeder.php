<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create permissions
        $permissions = [
            // Employee Management
            'view employees', 'create employees', 'edit employees', 'delete employees',

            // Department Management
            'view departments', 'create departments', 'edit departments', 'delete departments',

            // Attendance
            'view attendance', 'create attendance', 'edit attendance', 'approve attendance',

            // Leave Management
            'view leave', 'create leave', 'approve leave', 'reject leave',

            // Payroll
            'view payroll', 'create payroll', 'process payroll', 'approve payroll',

            // Reports
            'view reports', 'export reports',

            // Settings
            'manage settings', 'manage users', 'manage roles',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and assign permissions
        $adminRole = Role::firstOrCreate(['name' => 'Admin']);
        $adminRole->givePermissionTo(Permission::all());

        $hrRole = Role::firstOrCreate(['name' => 'HR']);
        $hrRole->givePermissionTo([
            'view employees', 'create employees', 'edit employees',
            'view departments', 'create departments', 'edit departments',
            'view attendance', 'edit attendance', 'approve attendance',
            'view leave', 'approve leave', 'reject leave',
            'view payroll', 'create payroll', 'process payroll',
            'view reports', 'export reports',
        ]);

        $managerRole = Role::firstOrCreate(['name' => 'Manager']);
        $managerRole->givePermissionTo([
            'view employees', 'edit employees',
            'view attendance', 'approve attendance',
            'view leave', 'approve leave',
            'view reports',
        ]);

        $employeeRole = Role::firstOrCreate(['name' => 'Employee']);
        $employeeRole->givePermissionTo([
            'view employees', // Can view their own profile
            'create attendance', // Clock in/out
            'create leave', // Request leave
        ]);
    }
}
