<?php

namespace App\Repositories;

use App\Contracts\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

abstract class BaseRepository implements BaseRepositoryInterface
{
    /**
     * Get the model class name.
     *
     * @return class-string<Model>
     */
    abstract protected function model(): string;

    /**
     * Get a new query builder instance.
     */
    protected function query(): Builder
    {
        return $this->model()::query();
    }

    /**
     * Get all records.
     */
    public function all(): Collection
    {
        return $this->query()->get();
    }

    /**
     * Get all records with relationships.
     *
     * @param  array<string>  $relations
     */
    public function allWith(array $relations): Collection
    {
        return $this->query()->with($relations)->get();
    }

    /**
     * Get paginated records.
     */
    public function paginate(int $perPage = 10): LengthAwarePaginator
    {
        return $this->query()->paginate($perPage);
    }

    /**
     * Find a record by ID.
     */
    public function find(string $id): ?Model
    {
        return $this->query()->find($id);
    }

    /**
     * Find a record by ID or fail.
     */
    public function findOrFail(string $id): Model
    {
        return $this->query()->findOrFail($id);
    }

    /**
     * Find with relationships.
     *
     * @param  array<string>  $relations
     */
    public function findWithRelations(string $id, array $relations): Model
    {
        return $this->query()->with($relations)->findOrFail($id);
    }

    /**
     * Create a new record.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Model
    {
        return $this->model()::create($data);
    }

    /**
     * Update a record.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(Model $model, array $data): bool
    {
        return $model->update($data);
    }

    /**
     * Delete a record.
     */
    public function delete(Model $model): bool
    {
        return $model->delete();
    }

    /**
     * Restore a soft-deleted record.
     */
    public function restore(Model $model): bool
    {
        return $model->restore();
    }

    /**
     * Force delete a record.
     */
    public function forceDelete(Model $model): bool
    {
        return $model->forceDelete();
    }

    /**
     * Get count of records.
     */
    public function count(): int
    {
        return $this->query()->count();
    }

    /**
     * Check if record exists by ID.
     */
    public function exists(string $id): bool
    {
        return $this->query()->where('id', $id)->exists();
    }

    /**
     * Get records ordered by column.
     */
    public function orderBy(string $column, string $direction = 'asc'): Collection
    {
        return $this->query()->orderBy($column, $direction)->get();
    }

    /**
     * Get records with count of relationships.
     *
     * @param  array<string>  $relations
     */
    public function withCount(array $relations): Collection
    {
        return $this->query()->withCount($relations)->get();
    }

    /**
     * Find records by a specific column value.
     */
    public function findByColumn(string $column, mixed $value): Collection
    {
        return $this->query()->where($column, $value)->get();
    }

    /**
     * Get the first record matching the column value.
     */
    public function firstByColumn(string $column, mixed $value): ?Model
    {
        return $this->query()->where($column, $value)->first();
    }
}
