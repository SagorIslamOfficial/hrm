<?php

namespace App\Modules\Department\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class DepartmentAccessMiddleware
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

        // Check if user has permission to access department module
        if (! Auth::user()->hasRole(['Admin', 'HR', 'Manager'])) {
            abort(403, 'Unauthorized access to Department module');
        }

        return $next($request);
    }
}
