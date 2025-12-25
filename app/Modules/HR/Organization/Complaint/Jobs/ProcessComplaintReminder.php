<?php

namespace App\Modules\HR\Organization\Complaint\Jobs;

use App\Modules\HR\Organization\Complaint\Models\ComplaintReminder;
use App\Modules\HR\Organization\Complaint\Notifications\ComplaintReminderNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessComplaintReminder implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public string $reminderId
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $reminder = ComplaintReminder::find($this->reminderId);

        if (! $reminder) {
            return;
        }

        // Check if already sent or rescheduled
        if ($reminder->is_sent) {
            return;
        }

        // Double check time
        if ($reminder->remind_at->isFuture()) {
            // Release back to queue with delay
            $this->release($reminder->remind_at->diffInSeconds(now()->addSeconds(5)));

            return;
        }

        $notifiable = $reminder->complaint->assignedTo;

        if (! $notifiable) {
            Log::warning("Skipping reminder {$reminder->id}: No assigned user for complaint {$reminder->complaint->complaint_number}");

            return;
        }

        try {
            Log::info("Processing reminder job for Complaint {$reminder->complaint->complaint_number}");

            $notifiable->notify(new ComplaintReminderNotification(
                $reminder->complaint,
                $reminder
            ));

            $reminder->markAsSent();
        } catch (\Exception $e) {
            Log::error("Failed to process reminder job {$reminder->id}", ['exception' => $e]);
            $this->fail($e);
        }
    }
}
