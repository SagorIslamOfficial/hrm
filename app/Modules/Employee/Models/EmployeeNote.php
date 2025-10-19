<?php

namespace App\Modules\Employee\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Modules\Employee\Database\Factories\EmployeeNoteFactory;

class EmployeeNote extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'employee_id',
        'created_by',
        'note',
        'is_private',
        'category',
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

    protected static function newFactory()
    {
        return EmployeeNoteFactory::new();
    }
}
