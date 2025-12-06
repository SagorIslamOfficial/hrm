<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserActivityLog extends Model
{
    /**
     * @var array<string>
     */
    protected $fillable = [
        'user_id',
        'action',
        'description',
        'changed_data',
        'causer_id',
        'causer_name',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'changed_data' => 'json',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function causer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'causer_id');
    }
}
