<?php

namespace App\Modules\HR\Organization\Complaint\Repositories;

use App\Modules\HR\Organization\Complaint\Contracts\ComplaintRepositoryInterface;
use App\Modules\HR\Organization\Complaint\Models\Complaint;
use App\Repositories\BaseRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class ComplaintRepository extends BaseRepository implements ComplaintRepositoryInterface
{
    // Define the model class.
    protected function model(): string
    {
        return Complaint::class;
    }

    // Override base paginate() to include eager loading for complaints.
    public function paginate(int $perPage = 10): LengthAwarePaginator
    {
        return $this->query()
            ->with([
                'employee:id,first_name,last_name,photo',
                'department:id,name',
                'assignedTo:id,name',
                'subjects.subject',
            ])
            ->withCount(['comments', 'documents'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }
}
