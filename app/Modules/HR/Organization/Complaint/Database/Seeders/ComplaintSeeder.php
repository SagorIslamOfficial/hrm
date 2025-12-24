<?php

namespace App\Modules\HR\Organization\Complaint\Database\Seeders;

use App\Models\User;
use App\Modules\HR\Employee\Models\Employee;
use App\Modules\HR\Organization\Complaint\Models\Complaint;
use App\Modules\HR\Organization\Complaint\Models\ComplaintComment;
use App\Modules\HR\Organization\Complaint\Models\ComplaintEscalation;
use App\Modules\HR\Organization\Complaint\Models\ComplaintReminder;
use App\Modules\HR\Organization\Complaint\Models\ComplaintStatusHistory;
use App\Modules\HR\Organization\Complaint\Models\ComplaintSubject;
use App\Modules\HR\Organization\Department\Models\Department;
use Faker\Factory as Faker;
use Faker\Generator;
use Illuminate\Database\Seeder;

class ComplaintSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();
        $employees = Employee::all();
        $departments = Department::all();
        $users = User::all();

        if ($employees->isEmpty()) {
            $this->command->warn('No employees found. Please run EmployeeSeeder first.');

            return;
        }

        $this->seedTemplates($faker, $users);
        $this->seedComplaints($faker, $employees, $departments, $users);
    }

    private function seedTemplates(Generator $faker, $users): void
    {
        $templates = [
            [
                'name' => 'Harassment Complaint',
                'categories' => ['harassment'],
                'description' => 'Template for reporting workplace harassment',
                'title_template' => 'Harassment Report - [Date]',
                'description_template' => 'I am filing this complaint regarding harassment that occurred on [date] at [location]. The incident involved [brief description].',
                'suggested_evidence' => ['Witness statements', 'Email correspondence', 'Screenshots of messages'],
            ],
            [
                'name' => 'Discrimination Complaint',
                'categories' => ['discrimination'],
                'description' => 'Template for reporting workplace discrimination',
                'title_template' => 'Discrimination Report - [Type]',
                'description_template' => 'I am filing this complaint regarding discrimination based on [protected characteristic]. This occurred on [date] when [brief description].',
                'suggested_evidence' => ['Documentation of incidents', 'Witness statements', 'Performance records'],
            ],
            [
                'name' => 'Safety Violation',
                'categories' => ['workplace_safety'],
                'description' => 'Template for reporting workplace safety violations',
                'title_template' => 'Safety Concern - [Area/Equipment]',
                'description_template' => 'I am reporting a safety concern regarding [issue]. This was observed at [location] on [date].',
                'suggested_evidence' => ['Photos of hazard', 'Incident reports', 'Safety inspection records'],
            ],
            [
                'name' => 'Policy Violation',
                'categories' => ['policy_violation'],
                'description' => 'Template for reporting company policy violations',
                'title_template' => 'Policy Violation Report - [Policy Name]',
                'description_template' => 'I am reporting a violation of [policy name]. The violation occurred on [date] and involved [brief description].',
                'suggested_evidence' => ['Policy documentation', 'Evidence of violation', 'Witness statements'],
            ],
            [
                'name' => 'Ethics Concern',
                'categories' => ['ethics', 'misconduct'],
                'description' => 'Template for reporting ethical concerns or misconduct',
                'title_template' => 'Ethics Concern - [Topic]',
                'description_template' => 'I am filing this report regarding an ethical concern involving [brief description]. This came to my attention on [date].',
                'suggested_evidence' => ['Financial records', 'Communication logs', 'Witness statements'],
            ],
        ];
    }

    private function seedComplaints(Generator $faker, $employees, $departments, $users): void
    {
        $categories = ['harassment', 'discrimination', 'workplace_safety', 'ethics', 'misconduct', 'policy_violation'];
        $priorities = ['low', 'medium', 'high', 'urgent'];
        $statuses = ['draft', 'submitted', 'under_review', 'investigating', 'escalated', 'resolved', 'closed'];

        // Create 30 complaints
        foreach (range(1, 30) as $index) {
            $employee = $employees->random();
            $department = $departments->random();
            $status = $faker->randomElement($statuses);
            $priority = $faker->randomElement($priorities);
            $assignedUser = $users->random();
            $resolvedAt = in_array($status, ['resolved', 'closed']) ? $faker->dateTimeBetween('-1 month', 'now') : null;

            $complaint = Complaint::create([
                'complaint_number' => 'CPL-'.date('Y').'-'.str_pad($index, 5, '0', STR_PAD_LEFT),
                'title' => $faker->sentence(6),
                'categories' => $faker->randomElements($categories, $faker->numberBetween(1, 3)),
                'priority' => $priority,
                'status' => $status,
                'employee_id' => $employee->id,
                'department_id' => $department->id,
                'assigned_to' => in_array($status, ['draft']) ? null : $assignedUser->id,
                'incident_date' => $faker->dateTimeBetween('-6 months', '-1 week'),
                'incident_location' => $faker->randomElement(['Office Building A', 'Office Building B', 'Warehouse', 'Conference Room', 'Parking Lot', 'Cafeteria']),
                'brief_description' => $faker->paragraph(2),
                'is_anonymous' => $faker->boolean(15),
                'is_confidential' => $faker->boolean(70),
                'is_recurring' => $faker->boolean(10),
                'sla_hours' => $faker->randomElement([24, 48, 72, 120]),
                'submitted_at' => in_array($status, ['draft']) ? null : $faker->dateTimeBetween('-3 months', '-1 week'),
                'due_date' => in_array($status, ['draft']) ? null : $faker->dateTimeBetween('-1 week', '+2 weeks'),
                'is_escalated' => $status === 'escalated',
                'escalated_at' => $status === 'escalated' ? $faker->dateTimeBetween('-1 month', 'now') : null,
                'escalated_to' => $status === 'escalated' ? $users->random()->id : null,
                'resolved_at' => $resolvedAt,
                'closed_at' => $status === 'closed' ? $faker->dateTimeBetween('-2 weeks', 'now') : null,
            ]);

            // Add subjects (people being complained about)
            $subjectCount = $faker->numberBetween(1, 2);
            $subjectEmployees = $employees->where('id', '!=', $employee->id)->random(min($subjectCount, $employees->count() - 1));

            foreach ($subjectEmployees as $subjectIndex => $subjectEmployee) {
                ComplaintSubject::create([
                    'complaint_id' => $complaint->id,
                    'subject_id' => $subjectEmployee->id,
                    'subject_type' => 'employee',
                    'relationship_to_complainant' => $faker->randomElement(['Manager', 'Colleague', 'Supervisor', 'Direct Report', 'Vendor']),
                    'specific_issue' => $faker->sentence(),
                    'is_primary' => $subjectIndex === 0,
                    'desired_outcome' => $faker->paragraph(),
                    'witnesses' => $faker->boolean(60) ? [
                        ['name' => $faker->name(), 'contact' => $faker->email(), 'relationship' => 'Colleague'],
                        ['name' => $faker->name(), 'contact' => $faker->phoneNumber(), 'relationship' => 'Supervisor'],
                    ] : null,
                    'previous_attempts_to_resolve' => $faker->boolean(30),
                    'previous_resolution_attempts' => $faker->boolean(30) ? $faker->paragraph() : null,
                ]);
            }

            // Add status history
            $this->createStatusHistory($complaint, $status, $faker, $users);

            // Add comments (for non-draft complaints)
            if ($status !== 'draft') {
                $commentCount = $faker->numberBetween(1, 5);
                foreach (range(1, $commentCount) as $c) {
                    ComplaintComment::create([
                        'complaint_id' => $complaint->id,
                        'comment' => $faker->paragraph(),
                        'comment_type' => $faker->randomElement(['internal', 'external']),
                        'is_private' => $faker->boolean(30),
                        'created_by' => $users->random()->id,
                    ]);
                }
            }

            // Add reminders (for active complaints)
            if (in_array($status, ['submitted', 'under_review', 'investigating'])) {
                $reminderCount = $faker->numberBetween(0, 3);
                foreach (range(1, $reminderCount) as $r) {
                    $remindAt = $faker->dateTimeBetween('-1 week', '+2 weeks');
                    $isSent = $remindAt < now();

                    ComplaintReminder::create([
                        'complaint_id' => $complaint->id,
                        'reminder_type' => $faker->randomElement(['follow_up', 'deadline', 'review', 'escalation']),
                        'remind_at' => $remindAt,
                        'is_sent' => $isSent,
                        'sent_at' => $isSent ? $remindAt : null,
                        'message' => $faker->sentence(),
                    ]);
                }
            }

            // Add escalations (for escalated complaints)
            if ($status === 'escalated') {
                ComplaintEscalation::create([
                    'complaint_id' => $complaint->id,
                    'escalated_from' => $assignedUser->id,
                    'escalated_to' => $complaint->escalated_to,
                    'escalation_level' => 'level_1',
                    'reason' => $faker->sentence(),
                    'escalated_at' => $complaint->escalated_at,
                    'escalated_by' => $users->random()->id,
                ]);
            }
        }
    }

    private function createStatusHistory(Complaint $complaint, string $currentStatus, Generator $faker, $users): void
    {
        $statusFlow = [
            'draft' => [],
            'submitted' => ['draft'],
            'under_review' => ['draft', 'submitted'],
            'investigating' => ['draft', 'submitted', 'under_review'],
            'escalated' => ['draft', 'submitted', 'under_review'],
            'resolved' => ['draft', 'submitted', 'under_review', 'investigating'],
            'closed' => ['draft', 'submitted', 'under_review', 'investigating', 'resolved'],
        ];

        $previousStatuses = $statusFlow[$currentStatus] ?? [];
        $previousStatus = null;

        foreach ($previousStatuses as $status) {
            ComplaintStatusHistory::create([
                'complaint_id' => $complaint->id,
                'from_status' => $previousStatus,
                'to_status' => $status,
                'notes' => $this->getStatusNote($status),
                'changed_by' => $users->random()->id,
            ]);
            $previousStatus = $status;
        }

        // Add current status
        ComplaintStatusHistory::create([
            'complaint_id' => $complaint->id,
            'from_status' => $previousStatus,
            'to_status' => $currentStatus,
            'notes' => $this->getStatusNote($currentStatus),
            'changed_by' => $users->random()->id,
        ]);
    }

    private function getStatusNote(string $status): string
    {
        return match ($status) {
            'draft' => 'Complaint created',
            'submitted' => 'Complaint submitted for review',
            'under_review' => 'Complaint acknowledged and under review',
            'investigating' => 'Investigation started',
            'escalated' => 'Escalated to senior management',
            'resolved' => 'Complaint resolved',
            'closed' => 'Complaint closed',
            default => 'Status updated',
        };
    }
}
