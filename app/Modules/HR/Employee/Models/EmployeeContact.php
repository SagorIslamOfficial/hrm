<?php

namespace App\Modules\HR\Employee\Models;

use App\Modules\HR\Employee\Database\Factories\EmployeeContactFactory;
use App\Traits\FileUploadTrait;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

class EmployeeContact extends Model
{
    use FileUploadTrait, HasFactory, HasUuids;

    protected $fillable = [
        'employee_id',
        'contact_name',
        'relationship',
        'phone',
        'email',
        'address',
        'photo',
        'is_primary',
    ];

    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
        ];
    }

    protected $appends = [
        'photo_url',
    ];

    /**
     * Upload and set contact photo
     */
    public function uploadPhoto(UploadedFile $photo): bool
    {
        try {
            // Delete existing photo if it exists
            if ($this->photo) {
                $this->deleteFile($this->photo, 'public');
            }

            // Create custom filename: contact_name-employee_code
            $name = strtolower($this->contact_name.'-'.$this->employee->employee_code);
            $name = str_replace(' ', '-', $name);
            $extension = $photo->getClientOriginalExtension();
            $filename = $name.'.'.$extension;

            // Upload new photo with custom name to public disk
            $path = $this->uploadFile($photo, 'employees/contacts/photos', 'public', $filename);

            if ($path) {
                return $this->update(['photo' => $path]);
            }

            return false;
        } catch (\Exception $e) {
            Log::error('Contact photo upload failed: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Delete contact photo
     */
    public function deletePhoto(): bool
    {
        try {
            if ($this->photo && $this->deleteFile($this->photo, 'public')) {
                return $this->update(['photo' => null]);
            }

            return false;
        } catch (\Exception $e) {
            Log::error('Contact photo deletion failed: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Get the full URL for the contact photo
     */
    public function getPhotoUrlAttribute(): ?string
    {
        return $this->photo ? $this->getFileUrl($this->photo, 'public') : null;
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Handle photo deletion when model is being deleted
     */
    protected static function boot()
    {
        parent::boot();

        // Clean up photo when contact is deleted
        static::deleting(function ($contact) {
            try {
                if ($contact->photo) {
                    $contact->deleteFile($contact->photo, 'public');
                }
            } catch (\Exception $e) {
                Log::error('Failed to delete contact photo during deletion: '.$e->getMessage());
            }
        });

        // Clean up old photo when a new one is being uploaded
        static::updating(function ($contact) {
            if ($contact->isDirty('photo') && $contact->getOriginal('photo')) {
                try {
                    $contact->deleteFile($contact->getOriginal('photo'), 'public');
                } catch (\Exception $e) {
                    Log::error('Failed to delete old contact photo during update: '.$e->getMessage());
                }
            }
        });
    }

    protected static function newFactory()
    {
        return EmployeeContactFactory::new();
    }
}
