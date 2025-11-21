<?php

namespace App\Modules\HR\Organization\Branch\Providers;

use App\Modules\HR\Organization\Branch\Contracts\BranchRepositoryContract;
use App\Modules\HR\Organization\Branch\Contracts\BranchServiceContract;
use App\Modules\HR\Organization\Branch\Http\Middleware\BranchAccessMiddleware;
use App\Modules\HR\Organization\Branch\Models\Branch;
use App\Modules\HR\Organization\Branch\Policies\BranchPolicy;
use App\Modules\HR\Organization\Branch\Repositories\BranchRepository;
use App\Modules\HR\Organization\Branch\Services\BranchService;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class BranchServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(BranchRepositoryContract::class, BranchRepository::class);
        $this->app->bind(BranchServiceContract::class, BranchService::class);
    }

    public function boot(): void
    {
        $this->loadMigrationsFrom(__DIR__.'/../Database/Migrations');

        // Load module config
        $this->mergeConfigFrom(__DIR__.'/../Config/branch.php', 'branch');

        // Publish config
        $this->publishes([
            __DIR__.'/../Config/branch.php' => config_path('branch.php'),
        ], 'branch-config');

        // Register policies
        Gate::policy(Branch::class, BranchPolicy::class);

        // Register middleware
        app('router')->aliasMiddleware('branch.access', BranchAccessMiddleware::class);
    }
}
