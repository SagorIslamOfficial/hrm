<?php

namespace App\Modules\HR\Employee\Models;

use App\Modules\HR\Employee\Employee\Database\Factories\EmployeeSalaryDetailFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeSalaryDetail extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'employee_id',
        'basic_salary',
        'allowances',
        'deductions',
        'net_salary',
        'bank_name',
        'bank_account_number',
        'bank_branch',
        'tax_id',
    ];

    protected function casts(): array
    {
        return [
            'basic_salary' => 'decimal:2',
            'allowances' => 'decimal:2',
            'deductions' => 'decimal:2',
            'net_salary' => 'decimal:2',
        ];
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    protected static function newFactory()
    {
        return EmployeeSalaryDetailFactory::new();
    }
}
