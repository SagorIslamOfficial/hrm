<?php

namespace App\Modules\Employee\Database\Seeders;

use App\Models\User;
use App\Modules\Department\Models\Department;
use App\Modules\Department\Models\Designation;
use App\Modules\Employee\Models\Employee;
use App\Modules\Employee\Models\EmployeeAttendance;
use App\Modules\Employee\Models\EmployeeContact;
use App\Modules\Employee\Models\EmployeeCustomField;
use App\Modules\Employee\Models\EmployeeDocument;
use App\Modules\Employee\Models\EmployeeJobDetail;
use App\Modules\Employee\Models\EmployeeLeave;
use App\Modules\Employee\Models\EmployeeNote;
use App\Modules\Employee\Models\EmployeePersonalDetail;
use App\Modules\Employee\Models\EmployeeSalaryDetail;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
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
            $employee = Employee::create([
                'employee_code' => 'EMP-'.str_pad($index, 5, '0', STR_PAD_LEFT),
                'first_name' => fake()->firstName(),
                'last_name' => fake()->lastName(),
                'email' => fake()->unique()->safeEmail(),
                'phone' => fake()->phoneNumber(),
                'photo' => null,
                'department_id' => $department->id,
                'designation_id' => $designation->id,
                'employment_status' => fake()->randomElement(['active', 'inactive', 'terminated', 'on_leave']),
                'employment_type' => fake()->randomElement(['permanent', 'contract', 'intern', 'part_time']),
                'joining_date' => fake()->dateTimeBetween('-5 years', 'now'),
            ]);

            // Create personal details
            EmployeePersonalDetail::create([
                'employee_id' => $employee->id,
                'date_of_birth' => fake()->dateTimeBetween('-60 years', '-20 years'),
                'gender' => fake()->randomElement(['male', 'female', 'other']),
                'marital_status' => fake()->randomElement(['single', 'married', 'divorced', 'widowed']),
                'blood_group' => fake()->randomElement(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
                'national_id' => fake()->numerify('##########'),
                'passport_number' => fake()->optional()->bothify('??######'),
                'address' => fake()->address(),
                'city' => fake()->city(),
                'country' => fake()->country(),
            ]);

            // Create job details
            EmployeeJobDetail::create([
                'employee_id' => $employee->id,
                'job_title' => fake()->jobTitle(),
                'employment_type' => $employee->employment_type,
                'supervisor_id' => null,
                'work_shift' => fake()->randomElement(['day', 'night', 'rotating', 'flexible']),
                'probation_end_date' => fake()->boolean(30) ? fake()->dateTimeBetween('now', '+6 months') : null,
                'contract_end_date' => $employee->employment_type === 'contract' ? fake()->dateTimeBetween('+6 months', '+3 years') : null,
            ]);

            // Create salary details
            $basicSalary = fake()->randomFloat(2, 30000, 150000);
            $allowances = fake()->randomFloat(2, 5000, 30000);
            $deductions = fake()->randomFloat(2, 2000, 15000);

            EmployeeSalaryDetail::create([
                'employee_id' => $employee->id,
                'basic_salary' => $basicSalary,
                'allowances' => $allowances,
                'deductions' => $deductions,
                'net_salary' => $basicSalary + $allowances - $deductions,
                'bank_name' => fake()->company().' Bank',
                'bank_account_number' => fake()->bankAccountNumber(),
                'bank_branch' => fake()->city().' Branch',
                'tax_id' => fake()->numerify('TIN-########'),
            ]);

            // Create 1-3 emergency contacts
            foreach (range(1, fake()->numberBetween(1, 3)) as $contactIndex) {
                EmployeeContact::create([
                    'employee_id' => $employee->id,
                    'contact_name' => fake()->name(),
                    'relationship' => fake()->randomElement(['spouse', 'parent', 'sibling', 'friend', 'other']),
                    'phone' => fake()->phoneNumber(),
                    'email' => fake()->optional()->safeEmail(),
                    'address' => fake()->address(),
                    'is_primary' => $contactIndex === 1,
                ]);
            }

            // Create 2-5 documents
            foreach (range(1, fake()->numberBetween(2, 5)) as $docIndex) {
                $docType = fake()->randomElement(['resume', 'contract', 'certificate', 'id_proof', 'other']);
                $fileName = fake()->word().'.pdf';

                EmployeeDocument::create([
                    'employee_id' => $employee->id,
                    'doc_type' => $docType,
                    'title' => fake()->sentence(3),
                    'file_path' => 'documents/employees/'.$fileName,
                    'file_name' => $fileName,
                    'file_size' => fake()->numberBetween(100000, 5000000),
                    'mime_type' => 'application/pdf',
                    'expiry_date' => fake()->optional()->dateTimeBetween('now', '+5 years'),
                    'uploaded_by' => $users->random()->id ?? null,
                ]);
            }

            // Create 1-3 notes
            foreach (range(1, fake()->numberBetween(1, 3)) as $noteIndex) {
                EmployeeNote::create([
                    'employee_id' => $employee->id,
                    'note' => fake()->paragraph(3),
                    'created_by' => $users->random()->id ?? null,
                    'is_private' => fake()->boolean(30),
                    'category' => fake()->randomElement(['general', 'performance', 'disciplinary', 'achievement', 'other']),
                ]);
            }

            // Create attendance records for the last 30 days
            foreach (range(0, 29) as $dayOffset) {
                $date = now()->subDays($dayOffset);

                // Skip weekends
                if ($date->isWeekend()) {
                    continue;
                }

                $checkIn = $date->copy()->setTime(fake()->numberBetween(8, 9), fake()->numberBetween(0, 59));
                $checkOut = fake()->boolean(90) ? $checkIn->copy()->addHours(fake()->numberBetween(8, 10)) : null;

                EmployeeAttendance::create([
                    'employee_id' => $employee->id,
                    'date' => $date,
                    'check_in' => $checkIn,
                    'check_out' => $checkOut,
                    'status' => fake()->randomElement(['present', 'absent', 'half_day', 'late', 'leave']),
                    'remarks' => fake()->optional()->sentence(),
                ]);
            }

            // Create 2-4 leave records
            foreach (range(1, fake()->numberBetween(2, 4)) as $leaveIndex) {
                $startDate = fake()->dateTimeBetween('-60 days', '+30 days');
                $endDate = (clone $startDate)->modify('+'.fake()->numberBetween(1, 7).' days');
                $totalDays = $startDate->diff($endDate)->days + 1;

                $status = fake()->randomElement(['pending', 'approved', 'rejected', 'cancelled']);
                $approvedBy = null;
                $approvedAt = null;

                if ($status === 'approved' && $startDate < now()) {
                    $approvedBy = $users->random()->id ?? null;
                    $approvedAt = fake()->dateTimeBetween($startDate, 'now');
                }

                EmployeeLeave::create([
                    'employee_id' => $employee->id,
                    'leave_type' => fake()->randomElement(['casual', 'sick', 'annual', 'maternity', 'paternity', 'unpaid']),
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'total_days' => $totalDays,
                    'status' => $status,
                    'reason' => fake()->sentence(),
                    'approved_by' => $approvedBy,
                    'approved_at' => $approvedAt,
                ]);
            }

            // Create 2-5 custom fields
            foreach (range(1, fake()->numberBetween(2, 5)) as $fieldIndex) {
                $fieldType = fake()->randomElement(['text', 'number', 'date', 'boolean', 'select']);

                $fieldValue = match ($fieldType) {
                    'text' => fake()->word(),
                    'number' => (string) fake()->numberBetween(1, 100),
                    'date' => fake()->date(),
                    'boolean' => fake()->boolean() ? 'true' : 'false',
                    'select' => fake()->randomElement(['Option 1', 'Option 2', 'Option 3']),
                };

                EmployeeCustomField::create([
                    'employee_id' => $employee->id,
                    'field_key' => fake()->unique()->slug(2),
                    'field_value' => $fieldValue,
                    'field_type' => $fieldType,
                    'section' => fake()->randomElement(['personal', 'professional', 'other']),
                ]);
            }
        }

        $this->command->info('Successfully seeded 50 employees with all related data!');
    }
}
