<?php

namespace App\Modules\Attendance\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AttendanceAccessMiddleware
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

        // Check if user has permission to access attendance module
        if (! Auth::user()->hasRole(['Admin', 'HR', 'Manager', 'Employee'])) {
            abort(403, 'Unauthorized access to Attendance module');
        }

        return $next($request);
    }
}
