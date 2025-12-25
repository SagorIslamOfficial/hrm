<?php

namespace App\Modules\HR\Organization\Complaint\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ComplaintResolution extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'complaint_id',
        'data',
        'resolved_by',
        'resolved_at',
    ];

    protected $casts = [
        'data' => 'array',
        'resolved_at' => 'datetime',
    ];

    public function complaint(): BelongsTo
    {
        return $this->belongsTo(Complaint::class);
    }

    public function resolvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }
}
