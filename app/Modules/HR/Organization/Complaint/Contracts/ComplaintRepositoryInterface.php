<?php

namespace App\Modules\HR\Organization\Complaint\Contracts;

use App\Contracts\BaseRepositoryInterface;

interface ComplaintRepositoryInterface extends BaseRepositoryInterface
{
    // Uses base repository methods + custom paginate() override
}

