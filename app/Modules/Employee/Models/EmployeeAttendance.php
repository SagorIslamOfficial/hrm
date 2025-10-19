<?php

namespace App\Modules\Employee\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Modules\Employee\Database\Factories\EmployeeAttendanceFactory;

class EmployeeAttendance extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'employee_attendance';

    protected $fillable = [
        'employee_id',
        'date',
        'check_in',
        'check_out',
        'status',
        'remarks',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
        ];
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    protected static function newFactory()
    {
        return EmployeeAttendanceFactory::new();
    }
}
