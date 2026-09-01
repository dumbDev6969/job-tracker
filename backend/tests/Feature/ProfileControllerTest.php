<?php

namespace Tests\Feature;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_access_profile(): void
    {
        $response = $this->getJson('/api/profile');
        $response->assertUnauthorized();

        $updateResponse = $this->putJson('/api/profile', ['headline' => 'Engineer']);
        $updateResponse->assertUnauthorized();
    }

    public function test_user_can_view_their_profile(): void
    {
        $user = User::factory()->create(['name' => 'Joshua Santos']);
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
            'headline' => 'Lead Full Stack Engineer',
            'location' => 'Manila, Philippines',
            'target_roles' => ['Tech Lead', 'Staff Engineer'],
            'custom_links' => [
                ['id' => '1', 'label' => 'Tech Blog', 'url' => 'https://blog.dev'],
            ],
        ]);

        $response = $this->actingAs($user)->getJson('/api/profile');

        $response->assertOk();
        $response->assertJsonPath('data.full_name', 'Joshua Santos');
        $response->assertJsonPath('data.headline', 'Lead Full Stack Engineer');
        $response->assertJsonPath('data.location', 'Manila, Philippines');
        $response->assertJsonPath('data.target_roles.0', 'Tech Lead');
        $response->assertJsonPath('data.custom_links.0.label', 'Tech Blog');
    }

    public function test_user_can_create_or_update_their_profile(): void
    {
        $user = User::factory()->create(['name' => 'Initial Name']);

        $payload = [
            'full_name' => 'Updated Name',
            'headline' => 'Senior Frontend Developer',
            'location' => 'Remote / Singapore',
            'phone' => '+65 8123 4567',
            'bio' => 'Building scalable web applications.',
            'status' => 'open_to_offers',
            'target_roles' => ['Frontend Architect', 'Senior Engineer'],
            'workplace_types' => ['Remote', 'Hybrid'],
            'employment_types' => ['Full-time', 'Contract'],
            'target_salary' => '$100,000 - $130,000 / year',
            'portfolio_url' => 'https://joshua.dev',
            'github_url' => 'https://github.com/joshua',
            'linkedin_url' => 'https://linkedin.com/in/joshua',
            'custom_links' => [
                ['id' => 'link-1', 'label' => 'Portfolio V2', 'url' => 'https://v2.portfolio.dev'],
            ],
            'resume_file_name' => 'Joshua_CV_2026.pdf',
        ];

        $response = $this->actingAs($user)->putJson('/api/profile', $payload);

        $response->assertOk();
        $response->assertJsonPath('data.full_name', 'Updated Name');
        $response->assertJsonPath('data.headline', 'Senior Frontend Developer');
        $response->assertJsonPath('data.status', 'open_to_offers');
        $response->assertJsonPath('data.custom_links.0.url', 'https://v2.portfolio.dev');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated Name',
        ]);

        $this->assertDatabaseHas('profiles', [
            'user_id' => $user->id,
            'headline' => 'Senior Frontend Developer',
            'status' => 'open_to_offers',
        ]);
    }

    public function test_profile_update_validates_status_enum(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->putJson('/api/profile', [
            'status' => 'invalid_status_value',
        ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['status']);
    }
}
