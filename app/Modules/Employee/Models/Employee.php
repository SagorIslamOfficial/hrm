<?php

namespace App\Modules\Employee\Models;

use App\Modules\Department\Models\Department;
use App\Modules\Department\Models\Designation;
use App\Modules\Employee\Database\Factories\EmployeeFactory;
use App\Traits\FileUploadTrait;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

class Employee extends Model
{
    use FileUploadTrait, HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'employee_code',
        'first_name',
        'last_name',
        'email',
        'phone',
        'photo',
        'department_id',
        'designation_id',
        'employment_status',
        'employment_type',
        'joining_date',
    ];

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
