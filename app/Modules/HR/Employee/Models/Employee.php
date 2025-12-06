<?php

namespace App\Modules\HR\Employee\Models;

use App\Models\User;
use App\Modules\HR\Employee\Database\Factories\EmployeeFactory;
use App\Modules\HR\Organization\Branch\Models\Branch;
use App\Modules\HR\Organization\Department\Models\Department;
use App\Modules\HR\Organization\Department\Models\Designation;
use App\Traits\FileUploadTrait;
use App\Traits\StatusManagement;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

/**
 * @property string $id
 * @property string $employee_code
 * @property string $first_name
 * @property string $last_name
 * @property string $email
 * @property string $phone
 * @property string $photo
 * @property string $branch_id
 * @property string $department_id
 * @property string $designation_id
 * @property string $employment_status
 * @property string $employment_type
 * @property string $joining_date
 * @property string $currency
 */
class Employee extends Model
{
    use FileUploadTrait, HasFactory, HasUuids, SoftDeletes, StatusManagement;

    protected $fillable = [
        'employee_code',
        'first_name',
        'last_name',
        'email',
        'phone',
        'photo',
        'branch_id',
        'department_id',
        'designation_id',
        'employment_status',
        'employment_type',
        'joining_date',
        'currency',
    ];

    /**
     * Available status options for employees.
     *
     * @var array<string>
     */
    protected static $statusOptions = ['active', 'inactive', 'terminated', 'on_leave'];

    /**
     * Map employment_status to status for the StatusManagement trait.
     */
    protected function getStatusAttribute(): string
    {
        return $this->attributes['employment_status'] ?? 'active';
    }

    protected function setStatusAttribute(string $value): void
    {
        $this->attributes['employment_status'] = $value;
    }

    /**
     * Override setStatus to use the employment_status column.
     * Syncing to linked user is handled by EmployeeObserver.
     */
    public function setStatus(string $status): self
    {
        $this->update(['employment_status' => $status]);

        return $this;
    }

    protected function casts(): array
    {
        return [
            'joining_date' => 'date:Y-m-d',
        ];
    }

    protected $appends = [
        'full_name',
        'photo_url',
    ];

    public function getFullNameAttribute(): string
    {
        return trim($this->first_name.' '.$this->last_name);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function designation(): BelongsTo
    {
        return $this->belongsTo(Designation::class);
    }

    public function personalDetail(): HasOne
    {
        return $this->hasOne(EmployeePersonalDetail::class);
    }

    public function jobDetail(): HasOne
    {
        return $this->hasOne(EmployeeJobDetail::class);
    }

    public function salaryDetail(): HasOne
    {
        return $this->hasOne(EmployeeSalaryDetail::class);
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(EmployeeContact::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(EmployeeDocument::class);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(EmployeeNote::class);
    }

    public function attendanceRecords(): HasMany
    {
        return $this->hasMany(EmployeeAttendance::class);
    }

    public function leaveRecords(): HasMany
    {
        return $this->hasMany(EmployeeLeave::class);
    }

    public function customFields(): HasMany
    {
        return $this->hasMany(EmployeeCustomField::class);
    }

    /**
     * Get the user account associated with this employee.
     */
    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'employee_id');
    }

    /**
     * Check if the employee has a linked user account.
     */
    public function hasUser(): bool
    {
        return $this->user()->exists();
    }

    /**
     * Upload and set employee photo
     */
    public function uploadPhoto(UploadedFile $photo): bool
    {
        try {
            // Delete existing photo if it exists
            if ($this->photo) {
                $this->deleteFile($this->photo, 'public');
            }

            // Create custom filename: employee_code-first_name-last_name
            $name = strtolower($this->employee_code.'-'.$this->first_name.'-'.$this->last_name);
            $name = str_replace(' ', '-', $name);
            $extension = $photo->getClientOriginalExtension();
            $filename = $name.'.'.$extension;

            // Upload new photo with custom name to public disk
            $path = $this->uploadFile($photo, 'employees/photos', 'public', $filename);

            if ($path) {
                return $this->update(['photo' => $path]);
            }

            return false;
        } catch (\Exception $e) {
            Log::error('Employee photo upload failed: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Delete employee photo
     */
    public function deletePhoto(): bool
    {
        try {
            if ($this->photo && $this->deleteFile($this->photo, 'public')) {
                return $this->update(['photo' => null]);
            }

            return false;
        } catch (\Exception $e) {
            Log::error('Employee photo deletion failed: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Get the full URL for the employee photo
     */
    public function getPhotoUrlAttribute(): ?string
    {
        return $this->photo ? $this->getFileUrl($this->photo, 'public') : null;
    }

    /**
     * Handle photo deletion when model is being deleted
     */
    protected static function boot()
    {
        parent::boot();

        // Clean up photo when employee is soft deleted
        static::deleting(function ($employee) {
            try {
                if ($employee->photo) {
                    $employee->deleteFile($employee->photo, 'public');
                }
            } catch (\Exception $e) {
                Log::error('Failed to delete employee photo during soft delete: '.$e->getMessage());
            }
        });

        // Clean up photo when employee is force deleted
        static::forceDeleting(function ($employee) {
            try {
                if ($employee->photo) {
                    $employee->deleteFile($employee->photo, 'public');
                }
            } catch (\Exception $e) {
                Log::error('Failed to delete employee photo during force delete: '.$e->getMessage());
            }
        });

        // Clean up old photo when a new one is being uploaded (via model updating)
        static::updating(function ($employee) {
            if ($employee->isDirty('photo') && $employee->getOriginal('photo')) {
                try {
                    $employee->deleteFile($employee->getOriginal('photo'), 'public');
                } catch (\Exception $e) {
                    Log::error('Failed to delete old employee photo during update: '.$e->getMessage());
                }
            }
        });
    }

    protected static function newFactory()
    {
        return EmployeeFactory::new();
    }
}
