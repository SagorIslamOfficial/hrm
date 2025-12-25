<?php

namespace App\Modules\HR\Organization\Complaint\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ComplaintReminder extends Model
{
    use HasUuids;

    protected $fillable = [
        'complaint_id',
        'reminder_type',
        'remind_at',
        'is_sent',
        'sent_at',
        'message',
    ];

    protected function casts(): array
    {
        return [
            'remind_at' => 'datetime',
            'is_sent' => 'boolean',
            'sent_at' => 'datetime',
        ];
    }

    public function complaint(): BelongsTo
    {
        return $this->belongsTo(Complaint::class);
    }

    public function markAsSent()
    {
        $this->update([
            'is_sent' => true,
            'sent_at' => now(),
        ]);
    }
}
