<?php

namespace App\Providers;

use App\Models\User;

use Laravel\Pennant\Feature;
use Illuminate\Support\ServiceProvider;
use App\Contracts\EmployeeServiceInterface;
use App\Contracts\EmployeeRepositoryInterface;
use App\Modules\Employee\Services\EmployeeService;
use App\Modules\Employee\Repositories\EmployeeRepository;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Bind interfaces to implementations
        $this->app->bind(EmployeeServiceInterface::class, EmployeeService::class);
        $this->app->bind(EmployeeRepositoryInterface::class, EmployeeRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Feature::define('super-admin', fn (User $user) => match (true) {
            $user->is_super_admin => true,
            default => false,
        });
    }
}
