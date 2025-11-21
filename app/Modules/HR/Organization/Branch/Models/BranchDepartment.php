<?php

namespace App\Modules\HR\Organization\Branch\Models;

use App\Modules\HR\Organization\Department\Models\Department;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

/**
 * Pivot model for branch_department relationship
 *
 * @property string $id
 * @property string $branch_id
 * @property string $department_id
 * @property float $budget_allocation
 * @property bool $is_primary
 */
class BranchDepartment extends Pivot
{
    use HasUuids;

    protected $table = 'branch_department';

    public $incrementing = false;

    protected $fillable = [
        'branch_id',
        'department_id',
        'budget_allocation',
        'is_primary',
    ];

    protected function casts(): array
    {
        return [
            'budget_allocation' => 'decimal:2',
            'is_primary' => 'boolean',
        ];
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
}
