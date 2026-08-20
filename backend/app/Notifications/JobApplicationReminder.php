<?php

namespace App\Notifications;

use App\Models\JobApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;

class JobApplicationReminder extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public JobApplication $jobApplication)
    {
    }

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
        $dateStr = $this->jobApplication->interview_date
            ? Carbon::parse($this->jobApplication->interview_date)->format('F j, Y')
            : 'tomorrow';

        return (new MailMessage)
            ->subject("Upcoming Interview Reminder: {$this->jobApplication->company}")
            ->greeting("Hello {$notifiable->name},")
            ->line("This is a reminder that you have an interview scheduled for tomorrow ({$dateStr}) for the {$this->jobApplication->role} position at {$this->jobApplication->company}.")
            ->line("Good luck with your preparation!")
            ->action('View Job Application', config('app.url', 'http://localhost:5173') . "/jobs/{$this->jobApplication->id}");
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'job_application_id' => $this->jobApplication->id,
            'company' => $this->jobApplication->company,
            'role' => $this->jobApplication->role,
            'interview_date' => $this->jobApplication->interview_date,
        ];
    }
}
