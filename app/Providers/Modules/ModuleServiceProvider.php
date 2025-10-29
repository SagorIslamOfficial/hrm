<?php

namespace App\Providers\Modules;

use Illuminate\Support\Facades\File;
use Illuminate\Support\ServiceProvider;

class ModuleServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $modules = $this->getModules();

        foreach ($modules as $module) {
            $providerClass = "App\\Modules\\{$module}\\Providers\\{$module}ServiceProvider";

            if (class_exists($providerClass)) {
                $this->app->register($providerClass);
            }
        }
    }

    public function boot(): void
    {
        // Additional module loading logic can go here
    }

    private function getModules(): array
    {
        $modulesPath = app_path('Modules');

        if (! File::exists($modulesPath)) {
            return [];
        }

        return collect(File::directories($modulesPath))
            ->map(fn ($path) => basename($path))
            ->toArray();
    }
}
