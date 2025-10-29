<?php

namespace App\Modules\Employee\Models;

use App\Models\User;
use App\Modules\Employee\Database\Factories\EmployeeNoteFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $employee_id
 * @property string $created_by
 * @property string $updated_by
 * @property string $note
 * @property bool $is_private
 * @property string $category
 */
class EmployeeNote extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'employee_id',
        'created_by',
        'updated_by',
        'note',
        'is_private',
        'category',
    ];

    protected $visible = [
        'id',
        'employee_id',
        'created_by',
        'updated_by',
        'note',
        'is_private',
        'category',
        'created_at',
        'updated_at',
        'creator',
        'updater',
    ];

    protected function casts(): array
    {
        return [
            'is_private' => 'boolean',
        ];
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    protected static function newFactory()
    {
        return EmployeeNoteFactory::new();
    }
}
