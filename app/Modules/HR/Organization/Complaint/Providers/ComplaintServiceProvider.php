<?php

namespace App\Modules\HR\Organization\Complaint\Providers;

use App\Modules\HR\Employee\Models\Employee;
use App\Modules\HR\Organization\Branch\Models\Branch;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintCommentRepositoryInterface;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintCommentServiceInterface;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintDocumentRepositoryInterface;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintDocumentServiceInterface;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintEscalationRepositoryInterface;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintEscalationServiceInterface;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintReminderRepositoryInterface;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintReminderServiceInterface;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintRepositoryInterface;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintResolutionRepositoryInterface;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintResolutionServiceInterface;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintServiceInterface;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintStatusHistoryRepositoryInterface;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintStatusServiceInterface;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintSubjectRepositoryInterface;
use App\Modules\HR\Organization\Complaint\Contracts\ComplaintSubjectServiceInterface;
use App\Modules\HR\Organization\Complaint\Models\Complaint;
use App\Modules\HR\Organization\Complaint\Policies\ComplaintPolicy;
use App\Modules\HR\Organization\Complaint\Repositories\ComplaintCommentRepository;
use App\Modules\HR\Organization\Complaint\Repositories\ComplaintDocumentRepository;
use App\Modules\HR\Organization\Complaint\Repositories\ComplaintEscalationRepository;
use App\Modules\HR\Organization\Complaint\Repositories\ComplaintReminderRepository;
use App\Modules\HR\Organization\Complaint\Repositories\ComplaintRepository;
use App\Modules\HR\Organization\Complaint\Repositories\ComplaintResolutionRepository;
use App\Modules\HR\Organization\Complaint\Repositories\ComplaintStatusHistoryRepository;
use App\Modules\HR\Organization\Complaint\Repositories\ComplaintSubjectRepository;
use App\Modules\HR\Organization\Complaint\Services\ComplaintCommentService;
use App\Modules\HR\Organization\Complaint\Services\ComplaintDocumentService;
use App\Modules\HR\Organization\Complaint\Services\ComplaintEscalationService;
use App\Modules\HR\Organization\Complaint\Services\ComplaintReminderService;
use App\Modules\HR\Organization\Complaint\Services\ComplaintResolutionService;
use App\Modules\HR\Organization\Complaint\Services\ComplaintService;
use App\Modules\HR\Organization\Complaint\Services\ComplaintStatusService;
use App\Modules\HR\Organization\Complaint\Services\ComplaintSubjectService;
use App\Modules\HR\Organization\Department\Models\Department;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class ComplaintServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Bind Repositories
        $this->app->bind(ComplaintRepositoryInterface::class, ComplaintRepository::class);
        $this->app->bind(ComplaintSubjectRepositoryInterface::class, ComplaintSubjectRepository::class);
        $this->app->bind(ComplaintCommentRepositoryInterface::class, ComplaintCommentRepository::class);
        $this->app->bind(ComplaintDocumentRepositoryInterface::class, ComplaintDocumentRepository::class);
        $this->app->bind(ComplaintEscalationRepositoryInterface::class, ComplaintEscalationRepository::class);
        $this->app->bind(ComplaintReminderRepositoryInterface::class, ComplaintReminderRepository::class);
        $this->app->bind(ComplaintResolutionRepositoryInterface::class, ComplaintResolutionRepository::class);
        $this->app->bind(ComplaintStatusHistoryRepositoryInterface::class, ComplaintStatusHistoryRepository::class);

        // Bind Services
        $this->app->bind(ComplaintServiceInterface::class, ComplaintService::class);
        $this->app->bind(ComplaintStatusServiceInterface::class, ComplaintStatusService::class);
        $this->app->bind(ComplaintSubjectServiceInterface::class, ComplaintSubjectService::class);
        $this->app->bind(ComplaintCommentServiceInterface::class, ComplaintCommentService::class);
        $this->app->bind(ComplaintDocumentServiceInterface::class, ComplaintDocumentService::class);
        $this->app->bind(ComplaintEscalationServiceInterface::class, ComplaintEscalationService::class);
        $this->app->bind(ComplaintReminderServiceInterface::class, ComplaintReminderService::class);
        $this->app->bind(ComplaintResolutionServiceInterface::class, ComplaintResolutionService::class);
    }

    public function boot(): void
    {
        $this->loadMigrationsFrom(__DIR__.'/../Database/Migrations');

        $this->mergeConfigFrom(__DIR__.'/../Config/complaint.php', 'complaint');

        $this->publishes([
            __DIR__.'/../Config/complaint.php' => config_path('complaint.php'),
        ], 'complaint-config');

        Gate::policy(Complaint::class, ComplaintPolicy::class);

        Relation::morphMap([
            'employee' => Employee::class,
            'department' => Department::class,
            'branch' => Branch::class,
        ]);
    }
}
