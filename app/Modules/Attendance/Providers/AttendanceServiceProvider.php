<?php

namespace App\Modules\Attendance\Providers;

use App\Modules\Attendance\Contracts\AttendanceRepositoryInterface;
use App\Modules\Attendance\Contracts\AttendanceServiceInterface;
use App\Modules\Attendance\Repositories\AttendanceRepository;
use App\Modules\Attendance\Services\AttendanceService;
use Illuminate\Support\ServiceProvider;

class AttendanceServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(AttendanceRepositoryInterface::class, AttendanceRepository::class);
        $this->app->bind(AttendanceServiceInterface::class, AttendanceService::class);
    }

    public function boot(): void
    {
        $this->loadMigrationsFrom(__DIR__.'/../Database/Migrations');

        // Load module config
        $this->mergeConfigFrom(__DIR__.'/../Config/attendance.php', 'attendance');

        // Publish config
        $this->publishes([
            __DIR__.'/../Config/attendance.php' => config_path('attendance.php'),
        ], 'attendance-config');
    }
}
