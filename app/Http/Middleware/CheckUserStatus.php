<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckUserStatus
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated and has a status that prevents access
        if (Auth::check()) {
            $user = Auth::user();

            // Prevent inactive and terminated users from accessing the system
            if ($user->isInactive() || $user->isTerminated()) {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                $message = $user->isTerminated()
                    ? 'Your employment has been terminated. Access is no longer available.'
                    : 'Your account has been deactivated. Please contact your administrator.';

                return redirect('/login')->with('error', $message);
            }
        }

        return $next($request);
    }
}
