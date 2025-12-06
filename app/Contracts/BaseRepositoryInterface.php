<?php

namespace App\Contracts;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

interface BaseRepositoryInterface
{
    /**
     * Get all records.
     */
    public function all(): Collection;

    /**
     * Get all records with relationships.
     *
     * @param  array<string>  $relations
     */
    public function allWith(array $relations): Collection;

    /**
     * Get paginated records.
     */
    public function paginate(int $perPage = 10): LengthAwarePaginator;

    /**
     * Find a record by ID.
     */
    public function find(string $id): ?Model;

    /**
     * Find a record by ID or fail.
     */
    public function findOrFail(string $id): Model;

    /**
     * Find with relationships.
     *
     * @param  array<string>  $relations
     */
    public function findWithRelations(string $id, array $relations): Model;

    /**
     * Create a new record.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Model;

    /**
     * Update a record.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(Model $model, array $data): bool;

    /**
     * Delete a record.
     */
    public function delete(Model $model): bool;

    /**
     * Restore a soft-deleted record.
     */
    public function restore(Model $model): bool;

    /**
     * Force delete a record.
     */
    public function forceDelete(Model $model): bool;

    /**
     * Get count of records.
     */
    public function count(): int;

    /**
     * Check if record exists by ID.
     */
    public function exists(string $id): bool;
}
