<?php

namespace App\Modules\HR\Organization\Branch\Models;

use App\Models\User;
use App\Modules\HR\Organization\Branch\Database\Factories\BranchDocumentFactory;
use App\Traits\FileUploadTrait;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

class BranchDocument extends Model
{
    use FileUploadTrait, HasFactory, HasUuids;

    protected $fillable = [
        'branch_id',
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

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
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
            // Load branch relationship if not loaded
            if (! $this->relationLoaded('branch')) {
                $this->load('branch');
            }

            // Ensure branch exists
            if (! $this->branch) {
                throw new \Exception('Branch relationship not found for document');
            }

            // Create custom filename: branch_code-doc_type-timestamp
            // Create custom filename: branch_code-doc_type-timestamp-uniqid
            $timestamp = now()->format('YmdHis');
            $name = strtolower($this->branch->code.'-'.$this->doc_type.'-'.$timestamp.'-'.uniqid());
            $name = str_replace(' ', '-', $name);
            $extension = $file->getClientOriginalExtension();
            $filename = $name.'.'.$extension;

            // Upload new file with custom name to public disk (using trait method)
            $path = $this->uploadFile($file, 'branches/documents', 'public', $filename);

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
            Log::error('Branch document file upload failed: '.$e->getMessage());

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
            Log::error('Branch document file deletion failed: '.$e->getMessage());

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

        $diff = abs($this->expiry_date->diffInDays(now()));

        return $this->expiry_date->isFuture() && $diff <= 30;
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
                Log::error('Failed to delete branch document file during deletion: '.$e->getMessage());
            }
        });

        // Clean up old file when a new one is being uploaded
        static::updating(function ($document) {
            if ($document->isDirty('file_path') && $document->getOriginal('file_path')) {
                try {
                    $document->deleteFile($document->getOriginal('file_path'), 'public');
                } catch (\Exception $e) {
                    Log::error('Failed to delete old branch document file during update: '.$e->getMessage());
                }
            }
        });
    }

    protected static function newFactory()
    {
        return BranchDocumentFactory::new();
    }
}
