<?php

namespace App\Modules\HR\Organization\Complaint\Enums;

enum ComplaintStatus: string
{
    case DRAFT = 'draft';
    case SUBMITTED = 'submitted';
    case UNDER_REVIEW = 'under_review';
    case INVESTIGATING = 'investigating';
    case PENDING_INFO = 'pending_info';
    case ESCALATED = 'escalated';
    case RESOLVED = 'resolved';
    case CLOSED = 'closed';
    case REJECTED = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Draft',
            self::SUBMITTED => 'Submitted',
            self::UNDER_REVIEW => 'Under Review',
            self::INVESTIGATING => 'Investigating',
            self::PENDING_INFO => 'Pending Information',
            self::ESCALATED => 'Escalated',
            self::RESOLVED => 'Resolved',
            self::CLOSED => 'Closed',
            self::REJECTED => 'Rejected',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::DRAFT => 'gray',
            self::SUBMITTED => 'blue',
            self::UNDER_REVIEW => 'yellow',
            self::INVESTIGATING => 'purple',
            self::PENDING_INFO => 'orange',
            self::ESCALATED => 'red',
            self::RESOLVED => 'green',
            self::CLOSED => 'slate',
            self::REJECTED => 'red',
        };
    }

    public function badgeClass(): string
    {
        return match ($this) {
            self::DRAFT => 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
            self::SUBMITTED => 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            self::UNDER_REVIEW => 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            self::INVESTIGATING => 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
            self::PENDING_INFO => 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
            self::ESCALATED => 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
            self::RESOLVED => 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            self::CLOSED => 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
            self::REJECTED => 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        };
    }

    public function isActive(): bool
    {
        return ! in_array($this, [self::RESOLVED, self::CLOSED, self::REJECTED]);
    }

    public function canEdit(): bool
    {
        return $this === self::DRAFT;
    }

    public function canSubmit(): bool
    {
        return $this === self::DRAFT;
    }

    public static function options(): array
    {
        return array_map(
            fn ($case) => [
                'value' => $case->value,
                'label' => $case->label(),
                'color' => $case->color(),
            ],
            self::cases()
        );
    }
}
