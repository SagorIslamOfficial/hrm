<?php

namespace App\Modules\HR\Organization\Complaint\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ComplaintComment extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'complaint_id',
        'comment',
        'comment_type',
        'is_private',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'is_private' => 'boolean',
        ];
    }

    public function complaint(): BelongsTo
    {
        return $this->belongsTo(Complaint::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
