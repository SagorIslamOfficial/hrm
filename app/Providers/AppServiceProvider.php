<?php

namespace App\Providers;

use App\Models\User;
use App\Modules\HR\Employee\Models\Employee;
use App\Observers\EmployeeObserver;
use App\Observers\UserObserver;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Queue\Events\JobProcessed;
use Illuminate\Queue\Events\JobProcessing;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\ServiceProvider;
use Laravel\Pennant\Feature;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Module bindings are handled by ModuleServiceProvider
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register model observers for automatic status syncing
        Employee::observe(EmployeeObserver::class);
        User::observe(UserObserver::class);

        // Configure rate limiting using container to avoid facade issues
        $rateLimiter = $this->app->make(\Illuminate\Cache\RateLimiter::class);
        $rateLimiter->for('web', fn (Request $request) => Limit::perMinute(60)->by($request->user()?->id ?: $request->ip()));
        $rateLimiter->for('login', fn (Request $request) => Limit::perMinute(5)->by($request->ip()));
        $rateLimiter->for('register', fn (Request $request) => Limit::perMinute(3)->by($request->ip()));
        $rateLimiter->for('password-reset', fn (Request $request) => Limit::perMinute(2)->by($request->ip()));

        Feature::define('super-admin', fn (User $user) => $user->hasRole('Admin'));

        // Logging for queued jobs
        Queue::before(function (JobProcessing $event) {
            $job = $event->job;
            Log::info('[QUEUE] Processing: '.$job->resolveName());
        });

        Queue::after(function (JobProcessed $event) {
            $job = $event->job;
            Log::info('[QUEUE] Processed: '.$job->resolveName());
        });
    }
}
