<?php

namespace App\Modules\HR\Organization\Complaint\Enums;

enum ComplaintSubjectType: string
{
    case EMPLOYEE = 'employee';
    case DEPARTMENT = 'department';
    case BRANCH = 'branch';
    case MANAGEMENT = 'management';
    case POLICY = 'policy';
    case WORKPLACE = 'workplace';
    case OTHER = 'other';

    public function label(): string
    {
        return match ($this) {
            self::EMPLOYEE => 'Employee',
            self::DEPARTMENT => 'Department',
            self::BRANCH => 'Branch',
            self::MANAGEMENT => 'Management',
            self::POLICY => 'Policy',
            self::WORKPLACE => 'Workplace',
            self::OTHER => 'Other',
        };
    }

    public static function options(): array
    {
        return array_map(
            fn ($case) => [
                'value' => $case->value,
                'label' => $case->label(),
            ],
            self::cases()
        );
    }
}
