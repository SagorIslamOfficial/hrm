<?php

namespace App\Modules\HR\Organization\Branch\Database\Seeders;

use App\Models\User;
use App\Modules\HR\Organization\Branch\Models\Branch;
use App\Modules\HR\Organization\Department\Models\Department;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

class BranchSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();
        $users = User::all();

        // Create Head Office
        $headOffice = Branch::firstOrCreate(
            ['code' => 'HQ001'],
            [
                'name' => 'Headquarters',
                'type' => 'head_office',
                'description' => 'Main headquarters and central office',
                'address_line_1' => $faker->streetAddress(),
                'address_line_2' => $faker->secondaryAddress(),
                'city' => 'Dhaka',
                'state' => 'Dhaka Division',
                'country' => 'Bangladesh',
                'postal_code' => '1200',
                'timezone' => 'Asia/Dhaka',
                'phone' => '+880 2 9876543',
                'phone_2' => '+880 1700000000',
                'email' => 'headquarters@company.com',
                'opening_date' => now()->subYears(5),
                'is_active' => true,
                'status' => 'active',
                'max_employees' => 500,
                'budget' => 50000000.00,
                'cost_center' => 'CC-HQ-001',
                'tax_registration_number' => 'TIN-'.mt_rand(10000000000, 99999999999),
            ]
        );

        // Create detail and settings for HQ
        $this->createBranchDetails($headOffice, $faker);
        $this->createBranchSettings($headOffice, $faker);
        $this->createBranchNotes($headOffice, $faker, $users);

        // Regional Offices
        $regions = [
            ['name' => 'North Region Office', 'code' => 'NR001', 'city' => 'Rangpur', 'state' => 'Rangpur Division'],
            ['name' => 'South Region Office', 'code' => 'SR001', 'city' => 'Chittagong', 'state' => 'Chittagong Division'],
            ['name' => 'East Region Office', 'code' => 'ER001', 'city' => 'Sylhet', 'state' => 'Sylhet Division'],
            ['name' => 'West Region Office', 'code' => 'WR001', 'city' => 'Khulna', 'state' => 'Khulna Division'],
        ];

        $regionalOffices = [];
        foreach ($regions as $region) {
            $branch = Branch::firstOrCreate(
                ['code' => $region['code']],
                [
                    'name' => $region['name'],
                    'type' => 'regional_office',
                    'description' => 'Regional office for '.$region['city'].' area',
                    'parent_id' => $headOffice->id,
                    'address_line_1' => $faker->streetAddress(),
                    'address_line_2' => $faker->secondaryAddress(),
                    'city' => $region['city'],
                    'state' => $region['state'],
                    'country' => 'Bangladesh',
                    'postal_code' => $faker->postcode(),
                    'timezone' => 'Asia/Dhaka',
                    'phone' => $faker->phoneNumber(),
                    'phone_2' => $faker->phoneNumber(),
                    'email' => strtolower(str_replace(' ', '', $region['name'])).'@company.com',
                    'opening_date' => now()->subYears(rand(1, 3)),
                    'is_active' => true,
                    'status' => 'active',
                    'max_employees' => 200,
                    'budget' => $faker->randomFloat(2, 5000000, 20000000),
                    'cost_center' => 'CC-'.strtoupper(substr($region['code'], 0, 2)).'-001',
                    'tax_registration_number' => 'TIN-'.mt_rand(10000000000, 99999999999),
                ]
            );

            $this->createBranchDetails($branch, $faker);
            $this->createBranchSettings($branch, $faker);
            $this->createBranchNotes($branch, $faker, $users);
            $regionalOffices[] = $branch;
        }

        // Branch Offices under each regional office
        foreach ($regionalOffices as $regionalOffice) {
            for ($i = 1; $i <= 2; $i++) {
                $branch = Branch::firstOrCreate(
                    ['code' => $regionalOffice->code.'-B'.$i],
                    [
                        'name' => $regionalOffice->city.' Branch '.$i,
                        'type' => 'branch_office',
                        'description' => 'Branch office in '.$regionalOffice->city,
                        'parent_id' => $regionalOffice->id,
                        'address_line_1' => $faker->streetAddress(),
                        'address_line_2' => $faker->secondaryAddress(),
                        'city' => $regionalOffice->city,
                        'state' => $regionalOffice->state,
                        'country' => 'Bangladesh',
                        'postal_code' => $faker->postcode(),
                        'timezone' => 'Asia/Dhaka',
                        'phone' => $faker->phoneNumber(),
                        'phone_2' => $faker->phoneNumber(),
                        'email' => strtolower($regionalOffice->code).'-b'.$i.'@company.com',
                        'opening_date' => now()->subYears(rand(1, 2)),
                        'is_active' => true,
                        'status' => 'active',
                        'max_employees' => 100,
                        'budget' => $faker->randomFloat(2, 1000000, 5000000),
                        'cost_center' => 'CC-'.$regionalOffice->code.'-B'.$i,
                        'tax_registration_number' => 'TIN-'.mt_rand(10000000000, 99999999999),
                    ]
                );

                $this->createBranchDetails($branch, $faker);
                $this->createBranchSettings($branch, $faker);
                $this->createBranchNotes($branch, $faker, $users);
            }
        }

        // Attach departments to branches
        $this->attachDepartmentsToBranches();
    }

    private function createBranchDetails(Branch $branch, $faker): void
    {
        $branch->detail()->firstOrCreate(
            ['branch_id' => $branch->id],
            [
                'latitude' => $faker->latitude(20, 26),
                'longitude' => $faker->longitude(88, 93),
                'working_hours' => [
                    'monday' => ['start' => '09:00', 'end' => '18:00'],
                    'tuesday' => ['start' => '09:00', 'end' => '18:00'],
                    'wednesday' => ['start' => '09:00', 'end' => '18:00'],
                    'thursday' => ['start' => '09:00', 'end' => '18:00'],
                    'friday' => ['start' => '09:00', 'end' => '18:00'],
                    'saturday' => ['start' => '09:00', 'end' => '14:00'],
                    'sunday' => ['start' => null, 'end' => null],
                ],
                'facilities' => $faker->randomElements(
                    ['parking', 'cafeteria', 'gym', 'daycare', 'prayer_room', 'lounge', 'conference_room'],
                    $faker->numberBetween(3, 5)
                ),
                'total_area' => $faker->randomFloat(2, 1000, 20000),
                'total_floors' => $faker->numberBetween(1, 5),
                'monthly_rent' => $faker->randomFloat(2, 100000, 500000),
                'monthly_utilities' => $faker->randomFloat(2, 10000, 50000),
                'monthly_maintenance' => $faker->randomFloat(2, 5000, 25000),
                'building_name' => $faker->company().' Building',
                'building_type' => $faker->randomElement(['owned', 'rented', 'leased']),
                'lease_start_date' => $faker->dateTimeBetween('-3 years', 'now'),
                'lease_end_date' => $faker->dateTimeBetween('now', '+5 years'),
                'lease_terms' => $faker->paragraph(),
                'property_contact_name' => $faker->name(),
                'property_contact_phone' => $faker->phoneNumber(),
                'property_contact_email' => $faker->companyEmail(),
                'property_contact_address' => $faker->address(),
            ]
        );
    }

    private function createBranchSettings(Branch $branch, $faker): void
    {
        $branch->settings()->firstOrCreate(
            ['branch_id' => $branch->id],
            [
                'allow_overtime' => true,
                'overtime_rate' => $faker->randomElement([1.5, 1.75, 2.0]),
                'allow_remote_work' => $faker->boolean(50),
                'remote_work_days_per_week' => $faker->numberBetween(1, 3),
                'standard_work_start' => '09:00',
                'standard_work_end' => '18:00',
                'standard_work_hours' => 8,
                'leave_policies' => [
                    'Annual' => 20,
                    'Sick' => 15,
                    'Casual' => 10,
                ],
                'approval_hierarchy' => [
                    'Leave' => ['Manager', 'HR'],
                    'Expense' => ['Manager', 'Finance'],
                ],
                'security_features' => [
                    ['name' => 'CCTV Surveillance'],
                    ['name' => 'Biometric Access'],
                    ['name' => 'Visitor Registration'],
                ],
                'currency' => 'BDT',
                'payment_method' => $faker->randomElement(['bank', 'cash', 'cheque']),
                'salary_payment_day' => $faker->numberBetween(25, 30),
                'primary_language' => 'en',
                'supported_languages' => ['en', 'bn'],
                'emergency_contact_name' => $faker->name(),
                'emergency_contact_phone' => $faker->phoneNumber(),
                'nearest_hospital' => $faker->company().' Hospital',
                'nearest_police_station' => $faker->city().' Police Station',
                'custom_settings' => [
                    'Dress Code' => 'Business Casual',
                    'Parking Fee' => $faker->randomFloat(2, 0, 500),
                    'Lunch Break Duration' => 60,
                ],
            ]
        );
    }

    private function createBranchNotes(Branch $branch, $faker, $users): void
    {
        if ($users->isEmpty()) {
            return;
        }

        $categories = ['general', 'performance', 'disciplinary', 'achievement', 'other'];
        $noteCount = $faker->numberBetween(2, 5);

        for ($i = 0; $i < $noteCount; $i++) {
            $creator = $users->random();
            $updater = $faker->boolean(70) ? $users->random() : $creator;

            $branch->notes()->firstOrCreate(
                [
                    'branch_id' => $branch->id,
                    'title' => $faker->sentence(3),
                ],
                [
                    'note' => $faker->paragraph(3),
                    'category' => $faker->randomElement($categories),
                    'is_private' => $faker->boolean(20),
                    'created_by' => $creator->id,
                    'updated_by' => $updater->id,
                ]
            );
        }
    }

    private function attachDepartmentsToBranches(): void
    {
        $departments = Department::all();
        $branches = Branch::all();

        foreach ($branches as $branch) {
            // Attach random departments to each branch
            $randomDepts = $departments->random(rand(3, 6));

            foreach ($randomDepts as $dept) {
                $branch->departments()->syncWithoutDetaching([
                    $dept->id => [
                        'budget_allocation' => rand(100000, 5000000),
                        'is_primary' => $branch->type === 'head_office' && rand(0, 1) === 1,
                    ],
                ]);
            }
        }
    }
}
