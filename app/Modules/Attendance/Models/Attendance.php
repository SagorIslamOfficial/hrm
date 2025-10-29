<?php

namespace App\Modules\Attendance\Models;

use App\Modules\Employee\Models\Employee;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Attendance extends Model
{
    use HasFactory;

    protected $table = 'employee_attendance';

    protected $fillable = [
        'employee_id',
        'date',
        'check_in',
        'check_out',
        'status',
        'remarks',
    ];

    protected $casts = [
        'date' => 'date',
        'check_in' => 'datetime',
        'check_out' => 'datetime',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function getIsLateAttribute(): bool
    {
        return $this->check_in && $this->check_in->format('H:i') > '09:00';
    }

    public function getIsEarlyDepartureAttribute(): bool
    {
        return $this->check_out && $this->check_out->format('H:i') < '17:00';
    }

    public function getWorkedHoursAttribute(): float
    {
        if (! $this->check_in || ! $this->check_out) {
            return 0;
        }

        // Handle both time strings (H:i:s) and datetime strings (Y-m-d H:i:s)
        $checkIn = is_string($this->check_in)
            ? Carbon::parse($this->check_in)
            : $this->check_in;

        $checkOut = is_string($this->check_out)
            ? Carbon::parse($this->check_out)
            : $this->check_out;

        return round($checkIn->diffInMinutes($checkOut) / 60, 2);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }
}
