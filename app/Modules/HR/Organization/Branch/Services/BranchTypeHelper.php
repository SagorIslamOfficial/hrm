<?php

namespace App\Modules\HR\Organization\Branch\Services;

class BranchTypeHelper
{
    /**
     * Get all available branch types
     */
    public static function getTypes(): array
    {
        return config('branch.types', []);
    }

    /**
     * Get type label by key
     */
    public static function getLabel(string $type): string
    {
        $types = config('branch.types', []);

        return $types[$type] ?? ucfirst(str_replace('_', ' ', $type));
    }

    /**
     * Check if type exists
     */
    public static function typeExists(string $type): bool
    {
        $types = config('branch.types', []);

        return isset($types[$type]);
    }

    /**
     * Get all type keys
     */
    public static function getTypeKeys(): array
    {
        return array_keys(config('branch.types', []));
    }
}
