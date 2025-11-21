<?php

namespace App\Modules\HR\Organization\Branch\Models;

use App\Traits\FileUploadTrait;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

/**
 * @property string $id
 * @property string $branch_id
 * @property float $latitude
 * @property float $longitude
 * @property array $working_hours
 * @property array $facilities
 * @property float $total_area
 * @property int $total_floors
 * @property string $floor_number
 * @property string $accessibility_features
 * @property float $monthly_rent
 * @property float $monthly_utilities
 * @property float $monthly_maintenance
 * @property float $security_deposit
 * @property string $building_name
 * @property string $building_type
 * @property string $lease_start_date
 * @property string $lease_end_date
 * @property string $lease_terms
 * @property string $property_contact_name
 * @property string $property_contact_phone
 * @property string $property_contact_email
 * @property string $property_contact_photo
 * @property string $property_contact_address
 */
class BranchDetail extends Model
{
    use FileUploadTrait, HasUuids;

    protected $fillable = [
        'branch_id',
        'latitude',
        'longitude',
        'working_hours',
        'facilities',
        'total_area',
        'total_floors',
        'floor_number',
        'accessibility_features',
        'monthly_rent',
        'monthly_utilities',
        'monthly_maintenance',
        'security_deposit',
        'building_name',
        'building_type',
        'lease_start_date',
        'lease_end_date',
        'lease_terms',
        'property_contact_name',
        'property_contact_phone',
        'property_contact_email',
        'property_contact_photo',
        'property_contact_address',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'working_hours' => 'array',
            'facilities' => 'array',
            'total_area' => 'decimal:2',
            'total_floors' => 'integer',
            'monthly_rent' => 'decimal:2',
            'monthly_utilities' => 'decimal:2',
            'monthly_maintenance' => 'decimal:2',
            'security_deposit' => 'decimal:2',
            'lease_start_date' => 'date',
            'lease_end_date' => 'date',
        ];
    }

    protected $appends = [
        'photo_url',
    ];

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    /**
     * Upload and set property contact photo
     */
    public function uploadPhoto(UploadedFile $photo): bool
    {
        try {
            // Delete existing photo if it exists
            if ($this->property_contact_photo) {
                $this->deleteFile($this->property_contact_photo, 'public');
            }

            // Create custom filename: branch_code-property-contact
            $branchCode = $this->branch?->code ?? 'branch';
            $name = strtolower($branchCode.'-property-contact');
            $extension = $photo->getClientOriginalExtension();
            $filename = $name.'.'.$extension;

            // Upload new photo with custom name to public disk
            $path = $this->uploadFile($photo, 'branches/property-contacts', 'public', $filename);

            if ($path) {
                return $this->update(['property_contact_photo' => $path]);
            }

            return false;
        } catch (\Exception $e) {
            Log::error('Property contact photo upload failed: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Delete property contact photo
     */
    public function deletePhoto(): bool
    {
        try {
            if ($this->property_contact_photo && $this->deleteFile($this->property_contact_photo, 'public')) {
                return $this->update(['property_contact_photo' => null]);
            }

            return false;
        } catch (\Exception $e) {
            Log::error('Property contact photo deletion failed: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Get the full URL for the property contact photo
     */
    public function getPhotoUrlAttribute(): ?string
    {
        return $this->property_contact_photo ? $this->getFileUrl($this->property_contact_photo, 'public') : null;
    }

    /**
     * Handle photo deletion when model is being deleted or updated
     */
    protected static function boot(): void
    {
        parent::boot();

        // Clean up photo when branch detail is deleted
        static::deleting(function ($detail) {
            try {
                if ($detail->property_contact_photo) {
                    $detail->deleteFile($detail->property_contact_photo, 'public');
                }
            } catch (\Exception $e) {
                Log::error('Failed to delete property contact photo during deletion: '.$e->getMessage());
            }
        });

        // Clean up old photo when a new one is being uploaded
        static::updating(function ($detail) {
            if ($detail->isDirty('property_contact_photo') && $detail->getOriginal('property_contact_photo')) {
                try {
                    $detail->deleteFile($detail->getOriginal('property_contact_photo'), 'public');
                } catch (\Exception $e) {
                    Log::error('Failed to delete old property contact photo during update: '.$e->getMessage());
                }
            }
        });
    }
}
