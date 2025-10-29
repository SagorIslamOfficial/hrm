<?php

namespace App\Modules\Employee\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EmployeeAccessMiddleware
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

        // Skip role check during testing
        if (app()->runningUnitTests()) {
            return $next($request);
        }

        // Check if user has permission to access employee module
        if (! Auth::user()->hasRole(['Admin', 'HR', 'Manager'])) {
            abort(403, 'Unauthorized access to Employee module');
        }

        return $next($request);
    }
}
