<?php

namespace App\Modules\Department\Models;

use App\Modules\Department\Database\Factories\DepartmentDetailFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DepartmentDetail extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'department_id',
        'founded_date',
        'division',
        'cost_center',
        'internal_code',
        'office_phone',
    ];

    protected function casts(): array
    {
        return [
            'founded_date' => 'date',
        ];
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    protected static function newFactory()
    {
        return DepartmentDetailFactory::new();
    }
}
