<?php

namespace App\Modules\HR\Organization\Branch\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $branch_id
 * @property int $created_by
 * @property int $updated_by
 * @property string $title
 * @property string $note
 * @property string $category
 * @property bool $is_private
 */
class BranchNote extends Model
{
    use HasUuids;

    protected $fillable = [
        'branch_id',
        'created_by',
        'updated_by',
        'title',
        'note',
        'category',
        'is_private',
    ];

    protected function casts(): array
    {
        return [
            'is_private' => 'boolean',
        ];
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
