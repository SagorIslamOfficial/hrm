<?php

namespace App\Providers\Modules;

use Illuminate\Support\Facades\File;
use Illuminate\Support\ServiceProvider;

class ModuleServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $providers = $this->findServiceProviders(); // Find all module service providers

        foreach ($providers as $providerClass) {
            if (class_exists($providerClass)) { // Check if the class exists
                $this->app->register($providerClass); // Register the service provider
            }
        }
    }

    public function boot(): void
    {
        // Additional module loading logic can go here
    }

    private function findServiceProviders(): array
    {
        $modulesPath = app_path('Modules'); //Get path: /app/Modules
        $providers = [];

        if (! File::exists($modulesPath)) {
            return $providers; // Return empty if Modules directory doesn't exist
        }

        $files = File::allFiles($modulesPath); // Get ALL files recursively from /app/Modules

        foreach ($files as $file) {
            if (str_ends_with($file->getFilename(), 'ServiceProvider.php')) {
                // Only process files that end with 'ServiceProvider.php'
                $relativePath = str_replace(app_path().'/', '', $file->getPathname());
                $namespace = 'App\\'.str_replace(['/', '.php'], ['\\', ''], $relativePath);

                $providers[] = $namespace;
            }
        }

        return $providers;
    }
}
