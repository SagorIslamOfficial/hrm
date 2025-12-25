<?php

namespace App\Modules\HR\Organization\Complaint\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ComplaintStatusHistory extends Model
{
    use HasUuids;

    protected $fillable = [
        'complaint_id',
        'from_status',
        'to_status',
        'notes',
        'changed_by',
    ];

    public function complaint(): BelongsTo
    {
        return $this->belongsTo(Complaint::class);
    }

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
