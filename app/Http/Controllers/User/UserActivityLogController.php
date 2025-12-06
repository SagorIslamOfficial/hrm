<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserActivityLog;
use Illuminate\Pagination\Paginator;

class UserActivityLogController extends Controller
{
    /**
     * Get paginated activity logs for a user.
     *
     * @return Paginator<UserActivityLog>
     */
    public function index(User $user): Paginator
    {
        return UserActivityLog::where('user_id', $user->id)
            ->latest('created_at')
            ->simplePaginate(perPage: 10);
    }
}
