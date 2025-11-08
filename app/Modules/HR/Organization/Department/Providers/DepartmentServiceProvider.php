<?php

namespace App\Modules\HR\Organization\Department\Providers;

use App\Modules\HR\Organization\Department\Contracts\DepartmentRepositoryInterface;
use App\Modules\HR\Organization\Department\Contracts\DepartmentServiceInterface;
use App\Modules\HR\Organization\Department\Contracts\DesignationRepositoryInterface;
use App\Modules\HR\Organization\Department\Contracts\DesignationServiceInterface;
use App\Modules\HR\Organization\Department\Models\Department;
use App\Modules\HR\Organization\Department\Models\Designation;
use App\Modules\HR\Organization\Department\Policies\DepartmentPolicy;
use App\Modules\HR\Organization\Department\Policies\DesignationPolicy;
use App\Modules\HR\Organization\Department\Repositories\DepartmentRepository;
use App\Modules\HR\Organization\Department\Repositories\DesignationRepository;
use App\Modules\HR\Organization\Department\Services\DepartmentService;
use App\Modules\HR\Organization\Department\Services\DesignationService;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class DepartmentServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(DepartmentRepositoryInterface::class, DepartmentRepository::class);
        $this->app->bind(DepartmentServiceInterface::class, DepartmentService::class);
        $this->app->bind(DesignationRepositoryInterface::class, DesignationRepository::class);
        $this->app->bind(DesignationServiceInterface::class, DesignationService::class);
    }

    public function boot(): void
    {
        $this->loadMigrationsFrom(__DIR__.'/../Database/Migrations');

        // Load module config
        $this->mergeConfigFrom(__DIR__.'/../Config/department.php', 'department');

        // Publish config
        $this->publishes([
            __DIR__.'/../Config/department.php' => config_path('department.php'),
        ], 'department-config');

        // Register policies
        Gate::policy(Department::class, DepartmentPolicy::class);
        Gate::policy(Designation::class, DesignationPolicy::class);
    }
}
