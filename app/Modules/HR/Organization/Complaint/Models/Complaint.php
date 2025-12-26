<?php

namespace App\Modules\HR\Organization\Complaint\Models;

use App\Models\User;
use App\Modules\HR\Employee\Models\Employee;
use App\Modules\HR\Organization\Complaint\Database\Factories\ComplaintFactory;
use App\Modules\HR\Organization\Complaint\Enums\ComplaintPriority;
use App\Modules\HR\Organization\Complaint\Enums\ComplaintStatus;
use App\Modules\HR\Organization\Department\Models\Department;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Complaint extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'complaint_number',
        'title',
        'categories',
        'priority',
        'status',
        'employee_id',
        'department_id',
        'assigned_to',
        'incident_date',
        'incident_location',
        'brief_description',
        'is_anonymous',
        'is_confidential',
        'is_recurring',
        'sla_hours',
        'sla_breach_at',
        'is_escalated',
        'escalated_at',
        'escalated_to',
        'submitted_at',
        'acknowledged_at',
        'resolved_at',
        'due_date',
        'follow_up_date',
    ];

    protected $appends = ['status_label', 'priority_label', 'priority_badge_class', 'status_badge_class', 'is_overdue'];

    protected $with = ['resolution'];

    protected function casts(): array
    {
        return [
            'categories' => 'array',
            'priority' => ComplaintPriority::class,
            'status' => ComplaintStatus::class,
            'incident_date' => 'date',
            'submitted_at' => 'datetime',
            'acknowledged_at' => 'datetime',
            'resolved_at' => 'datetime',
            'closed_at' => 'datetime',
            'due_date' => 'date',
            'follow_up_date' => 'date',
            'sla_breach_at' => 'datetime',
            'escalated_at' => 'datetime',
            'is_anonymous' => 'boolean',
            'is_confidential' => 'boolean',
            'is_recurring' => 'boolean',
            'is_escalated' => 'boolean',
            'escalated_to' => 'array',
        ];
    }

    // Relationships
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function subjects(): HasMany
    {
        return $this->hasMany(ComplaintSubject::class);
    }

    public function statusHistory(): HasMany
    {
        return $this->hasMany(ComplaintStatusHistory::class)->orderBy('created_at', 'desc');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(ComplaintComment::class)->orderBy('created_at', 'desc');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(ComplaintDocument::class);
    }

    public function escalations(): HasMany
    {
        return $this->hasMany(ComplaintEscalation::class)->orderBy('escalated_at', 'desc');
    }

    public function resolution(): HasOne
    {
        return $this->hasOne(ComplaintResolution::class);
    }

    public function reminders(): HasMany
    {
        return $this->hasMany(ComplaintReminder::class);
    }

    // Accessors
    public function getStatusLabelAttribute(): string
    {
        return $this->status?->label() ?? 'Unknown';
    }

    public function getPriorityLabelAttribute(): string
    {
        return $this->priority?->label() ?? 'Unknown';
    }

    public function getPriorityBadgeClassAttribute(): string
    {
        return $this->priority?->badgeClass() ?? '';
    }

    public function getStatusBadgeClassAttribute(): string
    {
        return $this->status?->badgeClass() ?? '';
    }

    public function getEscalatedToUsersAttribute()
    {
        $userIds = $this->escalated_to ?? [];
        if (! is_array($userIds)) { // Safety check if string/uuid
            $userIds = [$userIds];
        }

        return User::whereIn('id', $userIds)->get();
    }

    public function getIsOverdueAttribute(): bool
    {
        if (! $this->due_date || ! $this->status || in_array($this->status->value, ['resolved', 'closed', 'rejected'])) {
            return false;
        }

        return $this->due_date->isPast();
    }

    // Query Scopes
    public function scopeActive($query)
    {
        return $query->whereNotIn('status', ['resolved', 'closed', 'rejected']);
    }

    public function scopeOverdue($query)
    {
        return $query->where('due_date', '<', now())
            ->whereNotIn('status', ['resolved', 'closed', 'rejected']);
    }

    public function scopeEscalated($query)
    {
        return $query->where('is_escalated', true);
    }

    public function scopeByPriority($query, string $priority)
    {
        return $query->where('priority', $priority);
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByEmployee($query, string $employeeId)
    {
        return $query->where('employee_id', $employeeId);
    }

    public function scopeByDepartment($query, string $departmentId)
    {
        return $query->where('department_id', $departmentId);
    }

    public function scopeAssignedTo($query, string $userId)
    {
        return $query->where('assigned_to', $userId);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($complaint) {
            // Set department_id from employee's department if not provided
            if (empty($complaint->department_id) && $complaint->employee) {
                $complaint->department_id = $complaint->employee->department_id;
            }
        });

        static::updating(function ($complaint) {
            // Handle status change timestamps
            if ($complaint->isDirty('status')) {
                $newStatus = $complaint->status;
                $now = now();

                switch ($newStatus->value) {
                    case 'acknowledged':
                        $complaint->acknowledged_at = $complaint->acknowledged_at ?: $now;
                        break;
                    case 'resolved':
                        $complaint->resolved_at = $complaint->resolved_at ?: $now;
                        // Set follow_up_date if not set (e.g., 30 days after resolution)
                        if (! $complaint->follow_up_date) {
                            $complaint->follow_up_date = $now->addDays(30);
                        }
                        break;
                    case 'closed':
                        $complaint->closed_at = $complaint->closed_at ?: $now;
                        break;
                }
            }

            // Handle escalation
            if ($complaint->isDirty('is_escalated') && $complaint->is_escalated) {
                $complaint->escalated_at = $complaint->escalated_at ?: now();
            }
        });
    }

    protected static function newFactory()
    {
        return ComplaintFactory::new();
    }
}
