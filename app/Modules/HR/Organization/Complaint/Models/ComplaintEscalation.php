<?php

namespace App\Modules\HR\Organization\Complaint\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ComplaintEscalation extends Model
{
    use HasUuids;

    protected $fillable = [
        'complaint_id',
        'escalated_from',
        'escalated_to',
        'escalation_level',
        'reason',
        'escalated_at',
        'escalated_by',
    ];

    protected function casts(): array
    {
        return [
            'escalated_at' => 'datetime',
            'escalated_to' => 'array',
        ];
    }

    // Accessors
    public function getEscalatedToUsersAttribute()
    {
        $userIds = $this->escalated_to ?? [];
        return User::whereIn('id', $userIds)->get();
    }

    public function complaint(): BelongsTo
    {
        return $this->belongsTo(Complaint::class);
    }

    public function escalatedFrom(): BelongsTo
    {
        return $this->belongsTo(User::class, 'escalated_from');
    }

    public function escalatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'escalated_by');
    }
}
