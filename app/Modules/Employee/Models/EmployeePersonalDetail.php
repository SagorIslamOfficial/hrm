<?php

namespace App\Modules\Employee\Models;

use App\Modules\Employee\Database\Factories\EmployeePersonalDetailFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeePersonalDetail extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'employee_id',
        'date_of_birth',
        'gender',
        'marital_status',
        'blood_group',
        'national_id',
        'passport_number',
        'address',
        'city',
        'country',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
        ];
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    protected static function newFactory()
    {
        return EmployeePersonalDetailFactory::new();
    }
}
