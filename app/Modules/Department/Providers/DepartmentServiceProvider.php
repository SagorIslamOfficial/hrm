<?php

namespace App\Modules\Department\Providers;

use App\Modules\Department\Contracts\DepartmentRepositoryInterface;
use App\Modules\Department\Contracts\DepartmentServiceInterface;
use App\Modules\Department\Repositories\DepartmentRepository;
use App\Modules\Department\Services\DepartmentService;
use Illuminate\Support\ServiceProvider;

class DepartmentServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(DepartmentRepositoryInterface::class, DepartmentRepository::class);
        $this->app->bind(DepartmentServiceInterface::class, DepartmentService::class);
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
    }
}
