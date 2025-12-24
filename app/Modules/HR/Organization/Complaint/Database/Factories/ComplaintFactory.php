<?php

namespace App\Modules\HR\Organization\Complaint\Database\Factories;

use App\Modules\HR\Employee\Models\Employee;
use App\Modules\HR\Organization\Complaint\Models\Complaint;
use App\Modules\HR\Organization\Department\Models\Department;
use Illuminate\Database\Eloquent\Factories\Factory;

class ComplaintFactory extends Factory
{
    protected $model = Complaint::class;

    public function definition(): array
    {
        return [
            'complaint_number' => 'CPL-'.date('Y').'-'.fake()->unique()->numberBetween(10000, 99999),
            'title' => fake()->sentence(),
            'categories' => fake()->randomElements(['harassment', 'discrimination', 'workplace_safety', 'ethics', 'misconduct', 'policy_violation'], rand(1, 3)),
            'priority' => fake()->randomElement(['low', 'medium', 'high', 'urgent']),
            'status' => fake()->randomElement(['draft', 'submitted', 'under_review', 'investigating']),
            'employee_id' => Employee::inRandomOrder()->first()?->id,
            'department_id' => Department::inRandomOrder()->first()?->id,
            'incident_date' => fake()->dateTimeBetween('-3 months', 'now'),
            'incident_location' => fake()->optional()->city(),
            'brief_description' => fake()->paragraph(),
            'is_anonymous' => fake()->boolean(20),
            'is_confidential' => fake()->boolean(80),
            'is_recurring' => fake()->boolean(10),
            'sla_hours' => fake()->randomElement([24, 48, 72, 120]),
            'submitted_at' => fake()->optional()->dateTimeBetween('-2 months', 'now'),
            'due_date' => fake()->optional()->dateTimeBetween('now', '+2 weeks'),
        ];
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
            'submitted_at' => null,
            'assigned_to' => null,
        ]);
    }

    public function submitted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'submitted',
            'submitted_at' => now(),
            'due_date' => now()->addWeekdays(7),
        ]);
    }

    public function underReview(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'under_review',
            'submitted_at' => now()->subDays(2),
            'acknowledged_at' => now(),
            'due_date' => now()->addWeekdays(5),
        ]);
    }

    public function escalated(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'escalated',
            'is_escalated' => true,
            'escalated_at' => now(),
            'submitted_at' => now()->subDays(5),
        ]);
    }

    public function resolved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'resolved',
            'submitted_at' => now()->subWeek(),
            'resolved_at' => now(),
            'resolution' => [
                'resolution_summary' => fake()->paragraph(),
                'actions_taken' => fake()->paragraph(),
                'preventive_measures' => fake()->optional()->paragraph(),
                'resolved_by' => 1,
                'resolved_at' => now()->toIso8601String(),
            ],
        ]);
    }

    public function closed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'closed',
            'submitted_at' => now()->subWeeks(2),
            'resolved_at' => now()->subDays(3),
            'closed_at' => now(),
            'resolution' => [
                'resolution_summary' => fake()->paragraph(),
                'actions_taken' => fake()->paragraph(),
                'preventive_measures' => fake()->optional()->paragraph(),
                'satisfactory_to_complainant' => fake()->boolean(80),
                'satisfaction_rating' => fake()->numberBetween(1, 5),
                'complainant_feedback' => fake()->optional()->sentence(),
                'resolved_by' => 1,
                'resolved_at' => now()->subDays(3)->toIso8601String(),
            ],
        ]);
    }

    public function overdue(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'submitted',
            'submitted_at' => now()->subWeeks(2),
            'due_date' => now()->subDays(3),
        ]);
    }

    public function highPriority(): static
    {
        return $this->state(fn (array $attributes) => [
            'priority' => 'high',
        ]);
    }

    public function urgent(): static
    {
        return $this->state(fn (array $attributes) => [
            'priority' => 'urgent',
            'sla_hours' => 24,
        ]);
    }
}
