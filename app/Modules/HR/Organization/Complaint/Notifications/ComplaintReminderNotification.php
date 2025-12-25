<?php

namespace App\Modules\HR\Organization\Complaint\Notifications;

use App\Modules\HR\Organization\Complaint\Models\Complaint;
use App\Modules\HR\Organization\Complaint\Models\ComplaintReminder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ComplaintReminderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Complaint $complaint,
        public ComplaintReminder $reminder
    ) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Complaint Reminder: '.$this->complaint->complaint_number)
            ->line('This is a reminder for complaint: '.$this->complaint->title)
            ->line('Message: '.($this->reminder->message ?? 'No message provided'))
            ->line('Due: '.$this->reminder->remind_at->format('F j, Y g:i A'))
            ->action('View Complaint', route('complaints.show', $this->complaint->id));
    }

    public function toArray($notifiable): array
    {
        return [
            'complaint_id' => $this->complaint->id,
            'reminder_id' => $this->reminder->id,
            'title' => 'Reminder: '.$this->complaint->complaint_number,
            'message' => $this->reminder->message,
            'type' => $this->reminder->reminder_type,
            'link' => route('complaints.show', $this->complaint->id),
        ];
    }
}
