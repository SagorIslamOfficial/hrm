<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Modules\HR\Employee\Models\Employee;
use App\Traits\StatusManagement;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

/**
 * @property string $id
 * @property string $name
 * @property string $email
 * @property string|null $previous_email
 * @property string|null $created_by
 * @property Employee|null $employee
 * @property User|null $creator
 */
class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasRoles, Notifiable, SoftDeletes, StatusManagement, TwoFactorAuthenticatable;

    /**
     * The status options available for users.
     *
     * @var array<string>
     */
    protected static array $statusOptions = ['active', 'inactive', 'terminated'];

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'previous_email',
        'password',
        'employee_id',
        'created_by',
        'status',
    ];

    protected $appends = [
        'photo_url',
    ];

    protected $with = ['employee:id,photo,first_name,last_name'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'status' => 'string',
        ];
    }

    /**
     * Get the employee record associated with the user (includes soft-deleted).
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class)->withTrashed();
    }

    /**
     * Get the user who created this user.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Check if the user has a linked employee record.
     */
    public function hasEmployee(): bool
    {
        return $this->employee_id !== null;
    }

    /**
     * Get the photo URL from the linked employee.
     */
    public function getPhotoUrlAttribute(): ?string
    {
        return $this->employee?->photo_url;
    }

    /**
     * Check if the user's email was recently changed.
     */
    public function hasEmailChanged(): bool
    {
        return $this->previous_email !== null;
    }

    /**
     * Get a formatted message about the email change.
     */
    public function getEmailChangeMessage(): ?string
    {
        if (! $this->hasEmailChanged()) {
            return null;
        }

        return "Email changed from: {$this->previous_email}";
    }

    /**
     * Clear the previous email record (after user acknowledges the change).
     */
    public function clearPreviousEmail(): void
    {
        $this->update(['previous_email' => null]);
    }
}
