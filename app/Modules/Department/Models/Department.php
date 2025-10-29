<?php

namespace App\Modules\Department\Models;

use App\Modules\Department\Database\Factories\DepartmentFactory;
use App\Modules\Employee\Models\Employee;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'description',
        'manager_id',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function designations(): HasMany
    {
        return $this->hasMany(Designation::class);
    }

    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }

    /**
     * Get the count of employees in this department
     */
    public function getEmployeeCountAttribute(): int
    {
        return $this->employees()->count();
    }

    protected static function newFactory()
    {
        return DepartmentFactory::new();
    }
}
