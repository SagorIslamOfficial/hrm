<?php

namespace App\Modules\HR\Organization\Department\Models;

use App\Models\User;
use App\Modules\HR\Organization\Department\Database\Factories\DepartmentNoteFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DepartmentNote extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'department_id',
        'created_by',
        'updated_by',
        'title',
        'note',
        'category',
    ];

    protected $visible = [
        'id',
        'department_id',
        'created_by',
        'updated_by',
        'title',
        'note',
        'category',
        'created_at',
        'updated_at',
        'creator',
        'updater',
    ];

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    protected function casts(): array
    {
        return [];
    }

    protected static function newFactory()
    {
        return DepartmentNoteFactory::new();
    }
}
