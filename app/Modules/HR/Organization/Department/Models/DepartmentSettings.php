<?php

namespace App\Modules\HR\Organization\Department\Models;

use App\Modules\HR\Organization\Branch\Models\Branch;
use App\Modules\HR\Organization\Department\Database\Factories\DepartmentSettingsFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DepartmentSettings extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'department_id',
        'branch_id',
        'overtime_allowed',
        'travel_allowed',
        'home_office_allowed',
        'meeting_room_count',
        'desk_count',
        'requires_approval',
        'approval_level',
    ];

    protected function casts(): array
    {
        return [
            'overtime_allowed' => 'boolean',
            'travel_allowed' => 'boolean',
            'home_office_allowed' => 'boolean',
            'meeting_room_count' => 'integer',
            'desk_count' => 'integer',
            'requires_approval' => 'boolean',
        ];
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    protected static function newFactory()
    {
        return DepartmentSettingsFactory::new();
    }
}
