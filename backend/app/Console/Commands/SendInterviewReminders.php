<?php

namespace App\Console\Commands;

use App\Models\JobApplication;
use App\Notifications\JobApplicationReminder;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class SendInterviewReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'applications:send-interview-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send email notifications to users for job applications with interviews scheduled for tomorrow';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $tomorrow = Carbon::tomorrow()->toDateString();

        $applications = JobApplication::whereDate('interview_date', $tomorrow)
            ->whereNotNull('user_id')
            ->with('user')
            ->get();

        if ($applications->isEmpty()) {
            $this->info('No interview reminders to send for tomorrow (' . $tomorrow . ').');
            return Command::SUCCESS;
        }

        $sentCount = 0;

        foreach ($applications as $application) {
            if ($application->user) {
                $application->user->notify(new JobApplicationReminder($application));
                $sentCount++;
                $this->info("Sent interview reminder to {$application->user->email} for '{$application->company}' ({$application->role}).");
            }
        }

        $this->info("Sent {$sentCount} interview reminder notification(s).");

        return Command::SUCCESS;
    }
}
