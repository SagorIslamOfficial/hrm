<?php

namespace App\Modules\HR\Organization\Branch\Models;

use App\Modules\HR\Organization\Branch\Database\Factories\BranchCustomFieldFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BranchCustomField extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'branch_id',
        'field_key',
        'field_value',
        'field_type',
        'section',
    ];

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    /**
     * Create a new factory instance for the model.
     */
    protected static function newFactory()
    {
        return BranchCustomFieldFactory::new();
    }
}
