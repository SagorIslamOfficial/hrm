<?php

namespace App\Traits;

/**
 * Trait for managing status on models.
 * Provides consistent status checking and updating across the application.
 */
trait StatusManagement
{
    /**
     * Status constants.
     */
    const STATUS_ACTIVE = 'active';

    const STATUS_INACTIVE = 'inactive';

    const STATUS_TERMINATED = 'terminated';

    const STATUS_ON_LEAVE = 'on_leave';

    /**
     * Check if the model is active.
     */
    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    /**
     * Check if the model is inactive.
     */
    public function isInactive(): bool
    {
        return $this->status === self::STATUS_INACTIVE;
    }

    /**
     * Check if the model is terminated.
     */
    public function isTerminated(): bool
    {
        return $this->status === self::STATUS_TERMINATED;
    }

    /**
     * Check if the model is on leave.
     */
    public function isOnLeave(): bool
    {
        return $this->status === self::STATUS_ON_LEAVE;
    }

    /**
     * Activate the model.
     */
    public function activate(): self
    {
        $this->update(['status' => self::STATUS_ACTIVE]);

        return $this;
    }

    /**
     * Deactivate the model.
     */
    public function deactivate(): self
    {
        $this->update(['status' => self::STATUS_INACTIVE]);

        return $this;
    }

    /**
     * Terminate the model.
     */
    public function terminate(): self
    {
        $this->update(['status' => self::STATUS_TERMINATED]);

        return $this;
    }

    /**
     * Mark the model as on leave.
     */
    public function markOnLeave(): self
    {
        $this->update(['status' => self::STATUS_ON_LEAVE]);

        return $this;
    }

    /**
     * Check if the model has a specific status.
     */
    public function hasStatus(string $status): bool
    {
        return $this->status === $status;
    }

    /**
     * Set a specific status.
     */
    public function setStatus(string $status): self
    {
        $this->update(['status' => $status]);

        return $this;
    }
}
