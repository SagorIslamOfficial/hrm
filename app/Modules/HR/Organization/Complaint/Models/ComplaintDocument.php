<?php

namespace App\Modules\HR\Organization\Complaint\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ComplaintDocument extends Model
{
    use HasUuids;

    protected $fillable = [
        'complaint_id',
        'title',
        'description',
        'doc_type',
        'file_path',
        'uploaded_by',
    ];

    protected $appends = ['file_url', 'file_view_url'];

    public function complaint(): BelongsTo
    {
        return $this->belongsTo(Complaint::class);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function getFileUrlAttribute(): ?string
    {
        if (! $this->file_path) {
            return null;
        }

        return route('complaints.documents.download', [
            'complaint' => $this->complaint_id,
            'document' => $this->id,
        ]);
    }

    public function getFileViewUrlAttribute(): ?string
    {
        if (! $this->file_path) {
            return null;
        }

        return route('complaints.documents.view', [
            'complaint' => $this->complaint_id,
            'document' => $this->id,
        ]);
    }

    /**
     * Delete the file from storage.
     */
    public function deleteFile(): bool
    {
        $disk = config('complaint.uploads.disk', 'private');

        if (Storage::disk($disk)->exists($this->file_path)) {
            return Storage::disk($disk)->delete($this->file_path);
        }

        return true;
    }
}
