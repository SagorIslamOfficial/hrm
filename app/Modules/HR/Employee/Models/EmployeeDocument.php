<?php

namespace App\Modules\HR\Employee\Models;

use App\Models\User;
use App\Modules\HR\Employee\Database\Factories\EmployeeDocumentFactory;
use App\Traits\FileUploadTrait;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

class EmployeeDocument extends Model
{
    use FileUploadTrait, HasFactory, HasUuids;

    protected $fillable = [
        'employee_id',
        'doc_type',
        'title',
        'file_path',
        'file_name',
        'file_size',
        'mime_type',
        'expiry_date',
        'uploaded_by',
    ];

    protected function casts(): array
    {
        return [
            'expiry_date' => 'date',
        ];
    }

    protected $appends = [
        'file_url',
        'is_expired',
        'is_expiring_soon',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /**
     * Upload and set document file
     */
    public function uploadDocument(UploadedFile $file): bool
    {
        try {
            // Delete existing file if it exists
            if ($this->file_path) {
                $this->deleteFile($this->file_path, 'public');
            }

            // Load employee relationship if not loaded
            if (! $this->relationLoaded('employee')) {
                $this->load('employee');
            }

            // Ensure employee exists
            if (! $this->employee) {
                throw new \Exception('Employee relationship not found for document');
            }

            // Create custom filename: employee_code-doc_type-timestamp
            $timestamp = now()->format('Ymd');
            $name = strtolower($this->employee->employee_code.'-'.$this->doc_type.'-'.$timestamp);
            $name = str_replace(' ', '-', $name);
            $extension = $file->getClientOriginalExtension();
            $filename = $name.'.'.$extension;

            // Upload new file with custom name to public disk (using trait method)
            $path = $this->uploadFile($file, 'employees/documents', 'public', $filename);

            if ($path) {
                return $this->update([
                    'file_path' => $path,
                    'file_name' => $file->getClientOriginalName(),
                    'file_size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                ]);
            }

            return false;
        } catch (\Exception $e) {
            Log::error('Document file upload failed: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Delete document file
     */
    public function deleteDocument(): bool
    {
        try {
            if ($this->file_path && $this->deleteFile($this->file_path, 'public')) {
                return $this->update([
                    'file_path' => null,
                    'file_name' => null,
                    'file_size' => null,
                    'mime_type' => null,
                ]);
            }

            return false;
        } catch (\Exception $e) {
            Log::error('Document file deletion failed: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Get the full URL for the document file
     */
    public function getFileUrlAttribute(): ?string
    {
        return $this->file_path ? $this->getFileUrl($this->file_path, 'public') : null;
    }

    /**
     * Check if document is expired
     */
    public function getIsExpiredAttribute(): bool
    {
        if (! $this->expiry_date) {
            return false;
        }

        return $this->expiry_date->isPast();
    }

    /**
     * Check if document is expiring soon (within 30 days)
     */
    public function getIsExpiringSoonAttribute(): bool
    {
        if (! $this->expiry_date || $this->is_expired) {
            return false;
        }

        return $this->expiry_date->diffInDays(now()) <= 30;
    }

    /**
     * Handle file deletion when model is being deleted
     */
    protected static function boot()
    {
        parent::boot();

        // Clean up file when document is deleted
        static::deleting(function ($document) {
            try {
                if ($document->file_path) {
                    $document->deleteFile($document->file_path, 'public');
                }
            } catch (\Exception $e) {
                Log::error('Failed to delete document file during deletion: '.$e->getMessage());
            }
        });

        // Clean up old file when a new one is being uploaded
        static::updating(function ($document) {
            if ($document->isDirty('file_path') && $document->getOriginal('file_path')) {
                try {
                    $document->deleteFile($document->getOriginal('file_path'), 'public');
                } catch (\Exception $e) {
                    Log::error('Failed to delete old document file during update: '.$e->getMessage());
                }
            }
        });
    }

    protected static function newFactory()
    {
        return EmployeeDocumentFactory::new();
    }
}
