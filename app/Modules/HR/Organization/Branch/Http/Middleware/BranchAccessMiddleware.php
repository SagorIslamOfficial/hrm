<?php

namespace App\Modules\HR\Organization\Branch\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class BranchAccessMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated
        if (! Auth::check()) {
            return redirect()->route('login');
        }

        // Check if user has permission to access branch module
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (! $user->hasRole(['Admin', 'HR', 'Manager'])) {
            abort(403, 'Unauthorized access to Branch module');
        }

        return $next($request);
    }
}
