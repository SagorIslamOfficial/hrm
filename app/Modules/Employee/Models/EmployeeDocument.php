<?php

namespace App\Modules\Employee\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Modules\Employee\Database\Factories\EmployeeDocumentFactory;

class EmployeeDocument extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'employee_id',
        'doc_type',
        'title',
        'file_path',
        'file_name',
        'file_size',
        'mime_type',
        'expiry_date',
        'uploaded_by',
    ];

    protected function casts(): array
    {
        return [
            'expiry_date' => 'date',
        ];
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    protected static function newFactory()
    {
        return EmployeeDocumentFactory::new();
    }
}
