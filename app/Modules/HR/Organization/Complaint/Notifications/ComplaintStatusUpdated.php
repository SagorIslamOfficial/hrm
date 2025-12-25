<?php

namespace App\Modules\HR\Organization\Complaint\Notifications;

use App\Modules\HR\Organization\Complaint\Models\Complaint;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ComplaintStatusUpdated extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Complaint $complaint,
        public string $previousStatus,
        public ?string $recipientName = null
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $statusLabel = $this->complaint->status_label;
        $url = route('complaints.show', $this->complaint->id);
        $name = $this->recipientName ?? $notifiable->name ?? 'User';

        return (new MailMessage)
            ->subject('Complaint Status Update: '.$this->complaint->complaint_number)
            ->greeting('Hello '.$name.',')
            ->line('The status of your complaint ('.$this->complaint->complaint_number.') has been updated.')
            ->line('New Status: **'.$statusLabel.'**')
            ->line('Previous Status: '.ucfirst(str_replace('_', ' ', $this->previousStatus)))
            ->action('View Complaint', $url)
            ->line('Thank you for using our application.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'complaint_id' => $this->complaint->id,
            'status' => $this->complaint->status,
            'message' => 'Complaint status updated to '.$this->complaint->status_label,
        ];
    }
}
