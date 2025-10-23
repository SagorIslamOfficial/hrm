<?php

namespace App\Modules\Employee\Providers;

use App\Modules\Employee\Contracts\EmployeeDocumentRepositoryInterface;
use App\Modules\Employee\Contracts\EmployeeDocumentServiceInterface;
use App\Modules\Employee\Contracts\EmployeeRepositoryInterface;
use App\Modules\Employee\Contracts\EmployeeServiceInterface;
use App\Modules\Employee\Repositories\EmployeeDocumentRepository;
use App\Modules\Employee\Repositories\EmployeeRepository;
use App\Modules\Employee\Services\EmployeeDocumentService;
use App\Modules\Employee\Services\EmployeeService;
use Illuminate\Support\ServiceProvider;

class EmployeeServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(EmployeeRepositoryInterface::class, EmployeeRepository::class);
        $this->app->bind(EmployeeServiceInterface::class, EmployeeService::class);
        $this->app->bind(EmployeeDocumentRepositoryInterface::class, EmployeeDocumentRepository::class);
        $this->app->bind(EmployeeDocumentServiceInterface::class, EmployeeDocumentService::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Load module migrations
        $this->loadMigrationsFrom(__DIR__.'/../Database/Migrations');

        // Load module config
        $this->mergeConfigFrom(__DIR__.'/../Config/employee.php', 'employee');

        // Publish config
        $this->publishes([
            __DIR__.'/../Config/employee.php' => config_path('employee.php'),
        ], 'employee-config');
    }
}
