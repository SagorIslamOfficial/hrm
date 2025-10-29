<?php

namespace App\Modules\Employee\Contracts;

use App\Modules\Employee\Models\EmployeeDocument;

interface EmployeeDocumentServiceInterface
{
    public function createDocument(int|string $employeeId, array $data): EmployeeDocument;

    public function updateDocument(int|string $documentId, array $data): EmployeeDocument;

    public function deleteDocument(int|string $documentId): void;
}
