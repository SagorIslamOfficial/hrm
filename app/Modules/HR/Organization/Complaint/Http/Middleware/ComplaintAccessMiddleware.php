<?php

namespace App\Modules\HR\Organization\Complaint\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ComplaintAccessMiddleware
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

        // Check if user has permission to access complaint module
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // All authenticated users can access complaints
        // Role-based restrictions are handled at the controller/policy level
        if (! $user->hasAnyRole(['Admin', 'HR', 'Manager', 'Employee'])) {
            abort(403, 'Unauthorized access to Complaint module');
        }

        return $next($request);
    }
}
