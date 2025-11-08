<?php

namespace App\Modules\HR\Employee\Providers;

use App\Modules\HR\Employee\Contracts\EmployeeCustomFieldRepositoryInterface;
use App\Modules\HR\Employee\Contracts\EmployeeCustomFieldServiceInterface;
use App\Modules\HR\Employee\Contracts\EmployeeDocumentRepositoryInterface;
use App\Modules\HR\Employee\Contracts\EmployeeDocumentServiceInterface;
use App\Modules\HR\Employee\Contracts\EmployeeNoteRepositoryInterface;
use App\Modules\HR\Employee\Contracts\EmployeeNoteServiceInterface;
use App\Modules\HR\Employee\Contracts\EmployeeRepositoryInterface;
use App\Modules\HR\Employee\Contracts\EmployeeServiceInterface;
use App\Modules\HR\Employee\Models\EmployeeNote;
use App\Modules\HR\Employee\Policies\EmployeeNotePolicy;
use App\Modules\HR\Employee\Repositories\EmployeeCustomFieldRepository;
use App\Modules\HR\Employee\Repositories\EmployeeDocumentRepository;
use App\Modules\HR\Employee\Repositories\EmployeeNoteRepository;
use App\Modules\HR\Employee\Repositories\EmployeeRepository;
use App\Modules\HR\Employee\Services\EmployeeCustomFieldService;
use App\Modules\HR\Employee\Services\EmployeeDocumentService;
use App\Modules\HR\Employee\Services\EmployeeNoteService;
use App\Modules\HR\Employee\Services\EmployeeService;
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
