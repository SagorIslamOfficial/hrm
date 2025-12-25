<?php

namespace App\Modules\HR\Organization\Complaint\Models;

use App\Modules\HR\Organization\Complaint\Enums\ComplaintSubjectType;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ComplaintSubject extends Model
{
    use HasUuids;

    protected $fillable = [
        'complaint_id',
        'subject_id',
        'subject_type',
        'subject_name',
        'relationship_to_complainant',
        'specific_issue',
        'is_primary',
        'desired_outcome',
        'witnesses',
        'previous_attempts_to_resolve',
        'previous_resolution_attempts',
    ];

    protected function casts(): array
    {
        return [
            'subject_type' => ComplaintSubjectType::class,
            'is_primary' => 'boolean',
            'witnesses' => 'array',
            'previous_attempts_to_resolve' => 'boolean',
        ];
    }

    public function complaint(): BelongsTo
    {
        return $this->belongsTo(Complaint::class);
    }

    public function subject(): MorphTo
    {
        return $this->morphTo();
    }
}
