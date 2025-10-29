<?php

namespace App\Modules\Employee\Repositories;

use App\Modules\Employee\Contracts\EmployeeDocumentRepositoryInterface;
use App\Modules\Employee\Models\EmployeeDocument;
use Illuminate\Database\Eloquent\Collection;

class EmployeeDocumentRepository implements EmployeeDocumentRepositoryInterface
{
    public function create(array $data): EmployeeDocument
    {
        return EmployeeDocument::create($data);
    }

    public function findById(int|string $id): EmployeeDocument
    {
        return EmployeeDocument::findOrFail($id);
    }

    public function update(EmployeeDocument $document, array $data): bool
    {
        return $document->update($data);
    }

    public function delete(EmployeeDocument $document): bool
    {
        return $document->delete();
    }

    public function getByEmployeeId(int|string $employeeId): Collection
    {
        return EmployeeDocument::where('employee_id', $employeeId)
            ->with('uploader:id,name')
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
