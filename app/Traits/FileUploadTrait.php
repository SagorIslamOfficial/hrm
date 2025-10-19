<?php

namespace App\Traits;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

trait FileUploadTrait
{
    /**
     * Upload a file to the specified disk and directory
     */
    protected function uploadFile(UploadedFile $file, string $directory = 'uploads', ?string $disk = null, ?string $filename = null): string
    {
        $disk = $disk ?? config('filesystems.default');

        if (! $filename) {
            $filename = Str::uuid().'.'.$file->getClientOriginalExtension();
        }

        return $file->storeAs($directory, $filename, $disk);
    }

    /**
     * Delete a file from storage
     */
    protected function deleteFile(string $path, ?string $disk = null): bool
    {
        $disk = $disk ?? config('filesystems.default');

        if (Storage::disk($disk)->exists($path)) {
            return Storage::disk($disk)->delete($path);
        }

        return false;
    }

    /**
     * Get the full URL for a stored file
     */
    protected function getFileUrl(string $path, ?string $disk = null): string
    {
        if ($disk === 'public') {
            return Storage::url($path);
        }

        return Storage::url($path);
    }

    /**
     * Validate file upload rules
     */
    protected function getFileValidationRules(string $field = 'file', array $additionalRules = []): array
    {
        return array_merge([
            $field => ['required', 'file', 'max:5120'], // 5MB max
        ], $additionalRules);
    }

    /**
     * Validate image upload rules
     */
    protected function getImageValidationRules(string $field = 'image', array $additionalRules = []): array
    {
        return array_merge([
            $field => ['required', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'], // 2MB max for images
        ], $additionalRules);
    }
}
