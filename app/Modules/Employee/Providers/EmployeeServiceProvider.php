<?php

namespace App\Modules\Employee\Providers;

use App\Modules\Employee\Contracts\EmployeeCustomFieldRepositoryInterface;
use App\Modules\Employee\Contracts\EmployeeCustomFieldServiceInterface;
use App\Modules\Employee\Contracts\EmployeeDocumentRepositoryInterface;
use App\Modules\Employee\Contracts\EmployeeDocumentServiceInterface;
use App\Modules\Employee\Contracts\EmployeeNoteRepositoryInterface;
use App\Modules\Employee\Contracts\EmployeeNoteServiceInterface;
use App\Modules\Employee\Contracts\EmployeeRepositoryInterface;
use App\Modules\Employee\Contracts\EmployeeServiceInterface;
use App\Modules\Employee\Models\EmployeeNote;
use App\Modules\Employee\Policies\EmployeeNotePolicy;
use App\Modules\Employee\Repositories\EmployeeCustomFieldRepository;
use App\Modules\Employee\Repositories\EmployeeDocumentRepository;
use App\Modules\Employee\Repositories\EmployeeNoteRepository;
use App\Modules\Employee\Repositories\EmployeeRepository;
use App\Modules\Employee\Services\EmployeeCustomFieldService;
use App\Modules\Employee\Services\EmployeeDocumentService;
use App\Modules\Employee\Services\EmployeeNoteService;
use App\Modules\Employee\Services\EmployeeService;
use Illuminate\Support\Facades\Gate;
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
        $this->app->bind(EmployeeNoteRepositoryInterface::class, EmployeeNoteRepository::class);
        $this->app->bind(EmployeeNoteServiceInterface::class, EmployeeNoteService::class);
        $this->app->bind(EmployeeCustomFieldRepositoryInterface::class, EmployeeCustomFieldRepository::class);
        $this->app->bind(EmployeeCustomFieldServiceInterface::class, EmployeeCustomFieldService::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Register policies
        Gate::policy(EmployeeNote::class, EmployeeNotePolicy::class);

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
