<?php

namespace Tests\Feature;

use App\Models\JobApplication;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class JobApplicationControllerTest extends TestCase
{
    use RefreshDatabase;

    private function createJobApplication(User $user, array $overrides = []): JobApplication
    {
        return $user->jobApplications()->create(array_merge([
            'company' => 'Acme Corp',
            'role' => 'Software Engineer',
            'status' => 'applied',
        ], $overrides));
    }

    public function test_index_only_returns_the_authenticated_users_job_applications(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $ownJob = $this->createJobApplication($user);
        $this->createJobApplication($otherUser, ['company' => 'Other Co']);

        $response = $this->actingAs($user)->getJson('/api/job-applications');

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.id', $ownJob->id);
    }

    public function test_destroy_deletes_the_owners_job_application(): void
    {
        $user = User::factory()->create();
        $jobApplication = $this->createJobApplication($user);

        $response = $this->actingAs($user)->deleteJson("/api/job-applications/{$jobApplication->id}");

        $response->assertNoContent();
        $this->assertDatabaseMissing('job_applications', ['id' => $jobApplication->id]);
    }

    public function test_destroy_forbids_deleting_another_users_job_application(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $jobApplication = $this->createJobApplication($otherUser);

        $response = $this->actingAs($user)->deleteJson("/api/job-applications/{$jobApplication->id}");

        $response->assertForbidden();
        $this->assertDatabaseHas('job_applications', ['id' => $jobApplication->id]);
    }
}
