<?php

namespace App\Modules\HR\Organization\Department\Models;

use App\Modules\HR\Employee\Models\Employee;
use App\Modules\HR\Organization\Department\Database\Factories\DepartmentFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property string $id
 * @property string $name
 * @property string $code
 * @property string $description
 * @property string $manager_id
 * @property bool $is_active
 * @property float $budget
 * @property string $location
 * @property string $status
 */
class Department extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'description',
        'manager_id',
        'is_active',
        'budget',
        'location',
        'status',
    ];

    protected $appends = ['employee_count'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'budget' => 'decimal:2',
        ];
    }

    public function detail(): HasOne
    {
        return $this->hasOne(DepartmentDetail::class);
    }

    public function settings(): HasOne
    {
        return $this->hasOne(DepartmentSettings::class);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(DepartmentNote::class);
    }

    public function designations(): HasMany
    {
        return $this->hasMany(Designation::class);
    }

    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }

    public function manager(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'manager_id');
    }

    /**
     * Get the count of employees in this department
     */
    public function getEmployeeCountAttribute(): int
    {
        // Prefer using the loaded relationship when available to avoid extra queries
        return $this->relationLoaded('employees')
            ? $this->employees->count()
            : $this->employees()->count();
    }

    protected static function newFactory()
    {
        return DepartmentFactory::new();
    }
}
