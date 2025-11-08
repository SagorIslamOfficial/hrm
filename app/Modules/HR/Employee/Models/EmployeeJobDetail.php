<?php

namespace App\Modules\HR\Employee\Models;

use App\Modules\HR\Employee\Employee\Database\Factories\EmployeeJobDetailFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeJobDetail extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'employee_id',
        'job_title',
        'employment_type',
        'supervisor_id',
        'work_shift',
        'probation_end_date',
        'contract_end_date',
    ];

    protected function casts(): array
    {
        return [
            'probation_end_date' => 'date',
            'contract_end_date' => 'date',
        ];
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function supervisor(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'supervisor_id');
    }

    protected static function newFactory()
    {
        return EmployeeJobDetailFactory::new();
    }
}
