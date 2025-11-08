<?php

namespace App\Modules\HR\Employee\Contracts;

use App\Modules\HR\Employee\Models\EmployeeDocument;

interface EmployeeDocumentServiceInterface
{
    public function createDocument(int|string $employeeId, array $data): EmployeeDocument;

    public function updateDocument(int|string $documentId, array $data): EmployeeDocument;

    public function deleteDocument(int|string $documentId): void;
}
