<?php

namespace App\Modules\HR\Organization\Complaint\Http\Requests;

use App\Modules\HR\Organization\Complaint\Enums\ComplaintPriority;
use App\Modules\HR\Organization\Complaint\Enums\ComplaintSubjectType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateComplaintRequest extends FormRequest
{
    // Determine if the user is authorized to make this request.
    public function authorize(): bool
    {
        return true; // Authorization handled by policy
    }

    // Get the validation rules that apply to the request.
    public function rules(): array
    {
        return [
            // Complaint fields
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'categories' => ['nullable', 'array'],
            'categories.*' => ['nullable', 'string', 'max:100'],
            'priority' => ['sometimes', 'required', 'string', Rule::enum(ComplaintPriority::class)],
            'department_id' => ['nullable', 'uuid', 'exists:departments,id'],
            'incident_date' => ['sometimes', 'required', 'date', 'before_or_equal:today'],
            'incident_location' => ['nullable', 'string', 'max:255'],
            'brief_description' => ['sometimes', 'required', 'string', 'max:1000'],
            'assigned_to' => ['nullable', 'uuid', 'exists:users,id'],
            'is_confidential' => ['nullable', 'boolean'],
            'is_anonymous' => ['nullable', 'boolean'],
            'is_recurring' => ['nullable', 'boolean'],

            // Subject fields
            'subjects' => ['nullable', 'array'],
            'subjects.*.id' => ['nullable', 'string'],
            'subjects.*.subject_id' => ['nullable', 'uuid'],
            'subjects.*.subject_type' => ['required', 'string', Rule::enum(ComplaintSubjectType::class)],
            'subjects.*.subject_name' => ['nullable', 'string', 'max:255'],
            'subjects.*.relationship_to_complainant' => ['nullable', 'string', 'max:100'],
            'subjects.*.specific_issue' => ['required', 'string'],
            'subjects.*.is_primary' => ['required', 'boolean'],
            'subjects.*.desired_outcome' => ['nullable', 'string'],
            'subjects.*.previous_attempts_to_resolve' => ['nullable', 'boolean'],
            'subjects.*.previous_resolution_attempts' => ['nullable', 'string'],

            // Witness fields (nested in subjects)
            'subjects.*.witnesses' => ['nullable', 'array'],
            'subjects.*.witnesses.*.name' => ['nullable', 'string', 'max:50'],
            'subjects.*.witnesses.*.contact' => ['nullable', 'string', 'max:50'],
            'subjects.*.witnesses.*.relationship' => ['nullable', 'string', 'max:50'],

            // Comment fields
            'comments' => ['nullable', 'array'],
            'comments.*.id' => ['nullable', 'string'],
            'comments.*.comment' => ['required', 'string'],
            'comments.*.comment_type' => ['required', 'string', 'in:internal,external'],
            'comments.*.is_private' => ['required', 'boolean'],
            'comments.*._isNew' => ['nullable', 'boolean'],
            'comments.*._isModified' => ['nullable', 'boolean'],
            'comments.*._isDeleted' => ['nullable', 'boolean'],

            // Document fields
            'documents' => ['nullable', 'array'],
            'documents.*.id' => ['nullable', 'string'],
            'documents.*.title' => ['required', 'string'],
            'documents.*.description' => ['nullable', 'string'],
            'documents.*.doc_type' => ['required', 'string', 'in:evidence,resolution,supporting,other'],
            'documents.*.file' => ['nullable', 'file', 'max:10240'],
            'documents.*._isNew' => ['nullable', 'boolean'],
            'documents.*._isModified' => ['nullable', 'boolean'],
            'documents.*._isDeleted' => ['nullable', 'boolean'],
        ];
    }
}
