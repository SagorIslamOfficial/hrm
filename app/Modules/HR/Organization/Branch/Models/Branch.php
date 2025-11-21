<?php

namespace App\Modules\HR\Organization\Branch\Models;

use App\Modules\HR\Employee\Models\Employee;
use App\Modules\HR\Employee\Models\EmployeeJobDetail;
use App\Modules\HR\Organization\Branch\Database\Factories\BranchFactory;
use App\Modules\HR\Organization\Department\Models\Department;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property string $id
 * @property string $name
 * @property string $code
 * @property string $type
 * @property string $description
 * @property string $parent_id
 * @property string $manager_id
 * @property string $address_line_1
 * @property string $address_line_2
 * @property string $city
 * @property string $state
 * @property string $country
 * @property string $postal_code
 * @property string $timezone
 * @property string $phone
 * @property string $phone_2
 * @property string $email
 * @property string $opening_date
 * @property bool $is_active
 * @property string $status
 * @property int $max_employees
 * @property float $budget
 * @property string $cost_center
 * @property string $tax_registration_number
 */
class Branch extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'type',
        'description',
        'parent_id',
        'manager_id',
        'address_line_1',
        'address_line_2',
        'city',
        'state',
        'country',
        'postal_code',
        'timezone',
        'phone',
        'phone_2',
        'email',
        'opening_date',
        'is_active',
        'status',
        'max_employees',
        'budget',
        'cost_center',
        'tax_registration_number',
    ];

    protected $appends = ['employee_count', 'department_count', 'full_address', 'type_label'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'budget' => 'decimal:2',
            'opening_date' => 'date',
            'max_employees' => 'integer',
        ];
    }

    public function detail(): HasOne
    {
        return $this->hasOne(BranchDetail::class);
    }

    public function settings(): HasOne
    {
        return $this->hasOne(BranchSettings::class);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(BranchNote::class);
    }

    public function employees(): HasManyThrough
    {
        return $this->hasManyThrough(
            Employee::class,
            EmployeeJobDetail::class,
            'branch_id',
            'id',
            'id',
            'employee_id'
        );
    }

    public function manager(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'manager_id');
    }

    public function parentBranch(): BelongsTo
    {
        return $this->belongsTo(Branch::class, 'parent_id');
    }

    public function childBranches(): HasMany
    {
        return $this->hasMany(Branch::class, 'parent_id');
    }

    public function departments(): BelongsToMany
    {
        return $this->belongsToMany(
            Department::class,
            'branch_department',
            'branch_id',
            'department_id'
        )
            ->withPivot([
                'id',
                'budget_allocation',
                'is_primary',
            ])
            ->withTimestamps()
            ->using(BranchDepartment::class);
    }

    /**
     * Get the count of employees in this branch
     * Sum of all employees across departments assigned to this branch
     */
    public function getEmployeeCountAttribute(): int
    {
        // If departments are already loaded with their employee counts
        if ($this->relationLoaded('departments')) {
            return $this->departments->sum('employee_count');
        }

        // Otherwise, query the database efficiently
        return $this->departments()
            ->withCount('employees')
            ->get()
            ->sum('employees_count');
    }

    /**
     * Get the count of departments in this branch
     */
    public function getDepartmentCountAttribute(): int
    {
        return $this->relationLoaded('departments')
            ? $this->departments->count()
            : $this->departments()->count();
    }

    /**
     * Get the full formatted address
     */
    public function getFullAddressAttribute(): string
    {
        $parts = array_filter([
            $this->address_line_1,
            $this->address_line_2,
            $this->city,
            $this->state,
            $this->country,
            $this->postal_code,
        ]);

        return implode(', ', $parts);
    }

    /**
     * Get the human-readable type label
     */
    public function getTypeLabelAttribute(): string
    {
        $types = config('branch.types', []);

        return $types[$this->type] ?? ucfirst(str_replace('_', ' ', $this->type));
    }

    /**
     * Check if this branch has children
     */
    public function hasChildren(): bool
    {
        return $this->childBranches()->exists();
    }

    /**
     * Get the hierarchy level (0 for root, 1 for first level, etc.)
     */
    public function getHierarchyLevel(): int
    {
        $level = 0;
        $parent = $this->parentBranch;

        while ($parent) {
            $level++;
            $parent = $parent->parentBranch;
        }

        return $level;
    }

    protected static function newFactory()
    {
        return BranchFactory::new();
    }
}
