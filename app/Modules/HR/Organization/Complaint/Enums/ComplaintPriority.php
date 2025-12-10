<?php

namespace App\Modules\HR\Organization\Complaint\Enums;

enum ComplaintPriority: string
{
    case LOW = 'low';
    case MEDIUM = 'medium';
    case HIGH = 'high';
    case URGENT = 'urgent';
    case CRITICAL = 'critical';

    public function label(): string
    {
        return match ($this) {
            self::LOW => 'Low',
            self::MEDIUM => 'Medium',
            self::HIGH => 'High',
            self::URGENT => 'Urgent',
            self::CRITICAL => 'Critical',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::LOW => 'gray',
            self::MEDIUM => 'blue',
            self::HIGH => 'yellow',
            self::URGENT => 'orange',
            self::CRITICAL => 'red',
        };
    }

    public function badgeClass(): string
    {
        return match ($this) {
            self::LOW => 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
            self::MEDIUM => 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            self::HIGH => 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            self::URGENT => 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
            self::CRITICAL => 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        };
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
