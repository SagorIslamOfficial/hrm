<?php

namespace App\Modules\HR\Organization\Branch\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $branch_id
 * @property bool $allow_overtime
 * @property float $overtime_rate
 * @property bool $allow_remote_work
 * @property int $remote_work_days_per_week
 * @property string $standard_work_start
 * @property string $standard_work_end
 * @property int $standard_work_hours
 * @property array $leave_policies
 * @property array $approval_hierarchy
 * @property array $security_features
 * @property string $currency
 * @property string $payment_method
 * @property int $salary_payment_day
 * @property string $primary_language
 * @property array $supported_languages
 * @property string $emergency_contact_name
 * @property string $emergency_contact_phone
 * @property string $nearest_hospital
 * @property string $nearest_police_station
 * @property array $custom_settings
 */
class BranchSettings extends Model
{
    use HasUuids;

    protected $fillable = [
        'branch_id',
        'allow_overtime',
        'overtime_rate',
        'allow_remote_work',
        'remote_work_days_per_week',
        'standard_work_start',
        'standard_work_end',
        'standard_work_hours',
        'leave_policies',
        'approval_hierarchy',
        'security_features',
        'currency',
        'payment_method',
        'salary_payment_day',
        'primary_language',
        'supported_languages',
        'emergency_contact_name',
        'emergency_contact_phone',
        'nearest_hospital',
        'nearest_police_station',
        'custom_settings',
    ];

    protected function casts(): array
    {
        return [
            'allow_overtime' => 'boolean',
            'overtime_rate' => 'decimal:2',
            'allow_remote_work' => 'boolean',
            'remote_work_days_per_week' => 'integer',
            'standard_work_hours' => 'integer',
            'leave_policies' => 'array',
            'approval_hierarchy' => 'array',
            'security_features' => 'array',
            'salary_payment_day' => 'integer',
            'supported_languages' => 'array',
            'custom_settings' => 'array',
        ];
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }
}
