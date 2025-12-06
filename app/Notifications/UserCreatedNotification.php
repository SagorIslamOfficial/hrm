<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Password;

class UserCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        private string $plainPassword
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $appName = config('app.name');

        // Generate password reset token
        /** @var \Illuminate\Auth\Passwords\PasswordBroker $broker */
        $broker = Password::broker();
        $token = $broker->createToken($notifiable);
        $resetUrl = url(route('password.reset', [
            'token' => $token,
            'email' => $notifiable->email,
        ], false));

        return (new MailMessage)
            ->subject("Welcome to {$appName} - Your Account Details")
            ->greeting("Hello {$notifiable->name}!")
            ->line("Your account has been created on {$appName}.")
            ->line('Here are your login credentials:')
            ->line("**Email:** {$notifiable->email}")
            ->line("**Temporary Password:** {$this->plainPassword}")
            ->line('You can login using the credentials above, or reset your password using the button below:')
            ->action('Set Your Password', $resetUrl)
            ->line('This password reset link will expire in '.config('auth.passwords.users.expire', 60).' minutes.')
            ->line('For security reasons, we recommend changing your password after your first login.')
            ->salutation("Best regards,\n{$appName} Team");
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'Your account has been created.',
            'email' => $notifiable->email,
        ];
    }
}
