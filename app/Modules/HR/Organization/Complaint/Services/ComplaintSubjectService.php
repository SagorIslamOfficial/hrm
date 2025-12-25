<?php

namespace App\Modules\HR\Organization\Complaint\Services;

use App\Modules\HR\Organization\Complaint\Contracts\ComplaintSubjectRepositoryInterface;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintSubjectServiceInterface;
use App\Modules\HR\Organization\Complaint\Models\Complaint;
use App\Modules\HR\Organization\Complaint\Models\ComplaintSubject;

class ComplaintSubjectService implements ComplaintSubjectServiceInterface
{
    public function __construct(
        private ComplaintSubjectRepositoryInterface $subjectRepository
    ) {}

    // Sync subjects for a complaint (create, update, delete).
    public function syncSubjects(Complaint $complaint, array $subjects): void
    {
        $existingIds = $complaint->subjects()->pluck('id')->toArray();
        $processedIds = [];

        foreach ($subjects as $subjectData) {
            // Determine if this is an update or create
            $isUpdate = isset($subjectData['id'])
                && ! str_starts_with($subjectData['id'], 'temp-')
                && in_array($subjectData['id'], $existingIds);

            // Build the payload
            $subjectPayload = $this->buildPayload($subjectData);

            // Update or create the subject
            if ($isUpdate) {
                $this->updateSubject($complaint, $subjectData['id'], $subjectPayload);
                $processedIds[] = $subjectData['id'];
            } else {
                $this->createSubject($complaint, $subjectPayload);
            }
        }

        // Delete removed subjects
        $this->deleteRemovedSubjects($complaint, $existingIds, $processedIds);
    }

    // Create a new subject for a complaint.
    public function createSubject(Complaint $complaint, array $data): ComplaintSubject
    {
        $data['complaint_id'] = $complaint->id;

        return $this->subjectRepository->create($data);
    }

    // Update an existing subject.
    public function updateSubject(Complaint $complaint, string $subjectId, array $data): bool
    {
        $subject = $this->subjectRepository->findById($subjectId);

        return $this->subjectRepository->update($subject, $data);
    }

    // Delete subjects that were removed from the list.
    protected function deleteRemovedSubjects(Complaint $complaint, array $existingIds, array $processedIds): void
    {
        $idsToDelete = array_diff($existingIds, $processedIds);

        foreach ($idsToDelete as $id) {
            $subject = $this->subjectRepository->findById($id);
            $this->subjectRepository->delete($subject);
        }
    }

    // Build subject payload from input data.
    protected function buildPayload(array $data): array
    {
        return [
            'subject_id' => $data['subject_id'] ?? null,
            'subject_type' => $data['subject_type'],
            'subject_name' => $data['subject_name'] ?? null,
            'relationship_to_complainant' => $data['relationship_to_complainant'] ?? null,
            'specific_issue' => $data['specific_issue'],
            'is_primary' => $data['is_primary'] ?? false,
            'desired_outcome' => $data['desired_outcome'] ?? null,
            'witnesses' => $data['witnesses'] ?? [],
            'previous_attempts_to_resolve' => $data['previous_attempts_to_resolve'] ?? false,
            'previous_resolution_attempts' => $data['previous_resolution_attempts'] ?? null,
        ];
    }
}
