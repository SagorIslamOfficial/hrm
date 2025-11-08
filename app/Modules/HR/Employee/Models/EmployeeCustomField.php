<?php

namespace App\Modules\HR\Employee\Models;

use App\Modules\HR\Employee\Database\Factories\EmployeeCustomFieldFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeCustomField extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'employee_id',
        'field_key',
        'field_value',
        'field_type',
        'section',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    protected static function newFactory()
    {
        return EmployeeCustomFieldFactory::new();
    }
}
