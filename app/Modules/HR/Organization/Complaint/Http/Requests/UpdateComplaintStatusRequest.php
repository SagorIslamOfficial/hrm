<?php

namespace App\Modules\HR\Organization\Complaint\Http\Requests;

use App\Modules\HR\Organization\Complaint\Enums\ComplaintStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateComplaintStatusRequest extends FormRequest
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
            'status' => [
                'required',
                'string',
                Rule::enum(ComplaintStatus::class),
            ],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
