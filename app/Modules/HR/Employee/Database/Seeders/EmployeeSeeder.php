<?php

namespace App\Modules\HR\Employee\Database\Seeders;

use App\Models\User;
use App\Modules\HR\Employee\Models\Employee;
use App\Modules\HR\Employee\Models\EmployeeAttendance;
use App\Modules\HR\Employee\Models\EmployeeContact;
use App\Modules\HR\Employee\Models\EmployeeCustomField;
use App\Modules\HR\Employee\Models\EmployeeDocument;
use App\Modules\HR\Employee\Models\EmployeeJobDetail;
use App\Modules\HR\Employee\Models\EmployeeLeave;
use App\Modules\HR\Employee\Models\EmployeeNote;
use App\Modules\HR\Employee\Models\EmployeePersonalDetail;
use App\Modules\HR\Employee\Models\EmployeeSalaryDetail;
use App\Modules\HR\Organization\Department\Models\Department;
use App\Modules\HR\Organization\Department\Models\Designation;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();
        $departments = Department::where('is_active', true)->get();
        $users = User::all();

        if ($departments->isEmpty()) {
            $this->command->warn('No departments found. Please run DepartmentSeeder first.');

            return;
        }

        // Create 50 employees with all related data
        foreach (range(1, 50) as $index) {
            $department = $departments->random();
            $designation = Designation::where('department_id', $department->id)
                ->where('is_active', true)
                ->inRandomOrder()
                ->first();

            if (! $designation) {
                continue;
            }

            // Create employee
            $employee = Employee::firstOrCreate(
                ['employee_code' => 'EMP-'.str_pad($index, 5, '0', STR_PAD_LEFT)],
                [
                    'first_name' => $faker->firstName(),
                    'last_name' => $faker->lastName(),
                    'email' => $faker->unique()->safeEmail(),
                    'phone' => $faker->phoneNumber(),
                    'photo' => null,
                    'department_id' => $department->id,
                    'designation_id' => $designation->id,
                    'employment_status' => $faker->randomElement(['active', 'inactive', 'terminated', 'on_leave']),
                    'employment_type' => $faker->randomElement(['permanent', 'contract', 'intern', 'part_time']),
                    'joining_date' => $faker->dateTimeBetween('-5 years', 'now'),
                ]
            );

            // Create personal details
            EmployeePersonalDetail::firstOrCreate(
                ['employee_id' => $employee->id],
                [
                    'date_of_birth' => $faker->dateTimeBetween('-60 years', '-20 years'),
                    'gender' => $faker->randomElement(['male', 'female', 'other']),
                    'marital_status' => $faker->randomElement(['single', 'married', 'divorced', 'widowed']),
                    'blood_group' => $faker->randomElement(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
                    'national_id' => $faker->numerify('##########'),
                    'passport_number' => $faker->optional()->bothify('??######'),
                    'address' => $faker->address(),
                    'city' => $faker->city(),
                    'country' => $faker->country(),
                ]
            );

            // Create job details
            EmployeeJobDetail::firstOrCreate(
                ['employee_id' => $employee->id],
                [
                    'job_title' => $faker->jobTitle(),
                    'employment_type' => $employee->employment_type,
                    'supervisor_id' => null,
                    'work_shift' => $faker->randomElement(['day', 'night', 'rotating', 'flexible']),
                    'probation_end_date' => $faker->boolean(30) ? $faker->dateTimeBetween('now', '+6 months') : null,
                    'contract_end_date' => $employee->employment_type === 'contract' ? $faker->dateTimeBetween('+6 months', '+3 years') : null,
                ]
            );

            // Create salary details
            $basicSalary = $faker->randomFloat(2, 30000, 150000);
            $allowances = $faker->randomFloat(2, 5000, 30000);
            $deductions = $faker->randomFloat(2, 2000, 15000);

            EmployeeSalaryDetail::firstOrCreate(
                ['employee_id' => $employee->id],
                [
                    'basic_salary' => $basicSalary,
                    'allowances' => $allowances,
                    'deductions' => $deductions,
                    'net_salary' => $basicSalary + $allowances - $deductions,
                    'bank_name' => $faker->company().' Bank',
                    'bank_account_number' => $faker->bankAccountNumber(),
                    'bank_branch' => $faker->city().' Branch',
                    'tax_id' => $faker->numerify('TIN-########'),
                ]
            );

            // Create 1-3 emergency contacts
            $existingContacts = EmployeeContact::where('employee_id', $employee->id)->count();
            if ($existingContacts < 3) {
                foreach (range(1, $faker->numberBetween(1, 3 - $existingContacts)) as $contactIndex) {
                    EmployeeContact::create([
                        'employee_id' => $employee->id,
                        'contact_name' => $faker->name(),
                        'relationship' => $faker->randomElement(['spouse', 'parent', 'sibling', 'friend', 'other']),
                        'phone' => $faker->phoneNumber(),
                        'email' => $faker->optional()->safeEmail(),
                        'address' => $faker->address(),
                        'is_primary' => $contactIndex === 1 && $existingContacts === 0,
                    ]);
                }
            }

            // Create 2-5 documents
            $existingDocs = EmployeeDocument::where('employee_id', $employee->id)->count();
            if ($existingDocs < 5) {
                foreach (range(1, $faker->numberBetween(2, 5 - $existingDocs)) as $docIndex) {
                    $docType = $faker->randomElement(['resume', 'contract', 'certificate', 'id_proof', 'other']);
                    $fileName = $faker->word().'.pdf';

                    EmployeeDocument::create([
                        'employee_id' => $employee->id,
                        'doc_type' => $docType,
                        'title' => $faker->sentence(3),
                        'file_path' => 'documents/employees/'.$fileName,
                        'file_name' => $fileName,
                        'file_size' => $faker->numberBetween(100000, 5000000),
                        'mime_type' => 'application/pdf',
                        'expiry_date' => $faker->optional()->dateTimeBetween('now', '+5 years'),
                        'uploaded_by' => $users->random()->id ?? null,
                    ]);
                }
            }

            // Create 1-3 notes
            $existingNotes = EmployeeNote::where('employee_id', $employee->id)->count();
            if ($existingNotes < 3) {
                foreach (range(1, $faker->numberBetween(1, 3 - $existingNotes)) as $noteIndex) {
                    EmployeeNote::create([
                        'employee_id' => $employee->id,
                        'title' => $faker->sentence(rand(3, 5)),
                        'note' => $faker->paragraph(3),
                        'created_by' => $users->random()->id ?? 1, // fallback to first user
                        'is_private' => $faker->boolean(30),
                        'category' => $faker->randomElement(['general', 'performance', 'disciplinary', 'achievement', 'other']),
                    ]);
                }
            }

            // Create attendance records for the last 30 days
            for ($dayOffset = 0; $dayOffset < 30; $dayOffset++) {
                $date = now()->subDays($dayOffset)->toDateString(); // Use date string

                // Skip if attendance already exists for this date
                if (EmployeeAttendance::where('employee_id', $employee->id)->where('date', $date)->exists()) {
                    continue;
                }

                // Skip weekends
                $dateObj = now()->subDays($dayOffset);
                if ($dateObj->isWeekend()) {
                    continue;
                }

                $checkIn = $dateObj->copy()->setTime($faker->numberBetween(8, 9), $faker->numberBetween(0, 59));
                $checkOut = $faker->boolean(90) ? $checkIn->copy()->addHours($faker->numberBetween(8, 10)) : null;

                EmployeeAttendance::create([
                    'employee_id' => $employee->id,
                    'date' => $date,
                    'check_in' => $checkIn,
                    'check_out' => $checkOut,
                    'status' => $faker->randomElement(['present', 'absent', 'half_day', 'late', 'leave']),
                    'remarks' => $faker->optional()->sentence(),
                ]);
            }

            // Create 2-4 leave records
            $existingLeaves = EmployeeLeave::where('employee_id', $employee->id)->count();
            if ($existingLeaves < 4) {
                foreach (range(1, $faker->numberBetween(2, 4 - $existingLeaves)) as $leaveIndex) {
                    $startDate = $faker->dateTimeBetween('-60 days', '+30 days');
                    $endDate = (clone $startDate)->modify('+'.$faker->numberBetween(1, 7).' days');
                    $totalDays = $startDate->diff($endDate)->days + 1;

                    $status = $faker->randomElement(['pending', 'approved', 'rejected', 'cancelled']);
                    $approvedBy = null;
                    $approvedAt = null;

                    if ($status === 'approved' && $startDate < now()) {
                        $approvedBy = $users->random()->id ?? 1;
                        $approvedAt = $faker->dateTimeBetween($startDate, 'now');
                    }

                    EmployeeLeave::create([
                        'employee_id' => $employee->id,
                        'leave_type' => $faker->randomElement(['casual', 'sick', 'annual', 'maternity', 'paternity', 'unpaid']),
                        'start_date' => $startDate,
                        'end_date' => $endDate,
                        'total_days' => $totalDays,
                        'status' => $status,
                        'reason' => $faker->sentence(),
                        'approved_by' => $approvedBy,
                        'approved_at' => $approvedAt,
                    ]);
                }
            }

            // Create 2-5 custom fields
            $existingFields = EmployeeCustomField::where('employee_id', $employee->id)->count();
            if ($existingFields < 5) {
                foreach (range(1, $faker->numberBetween(2, 5 - $existingFields)) as $fieldIndex) {
                    $fieldType = $faker->randomElement(['text', 'number', 'date', 'boolean', 'select']);

                    $fieldValue = match ($fieldType) {
                        'text' => $faker->word(),
                        'number' => (string) $faker->numberBetween(1, 100),
                        'date' => $faker->date(),
                        'boolean' => $faker->boolean() ? 'true' : 'false',
                        'select' => $faker->randomElement(['Option 1', 'Option 2', 'Option 3']),
                    };

                    EmployeeCustomField::firstOrCreate(
                        ['employee_id' => $employee->id, 'field_key' => 'field'.$fieldIndex],
                        [
                            'field_value' => $fieldValue,
                            'field_type' => $fieldType,
                            'section' => $faker->randomElement(['personal', 'professional', 'other']),
                        ]
                    );
                }
            }
        }
    }
}
