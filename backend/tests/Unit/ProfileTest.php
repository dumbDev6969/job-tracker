<?php

namespace Tests\Unit;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_have_a_profile_and_relationship_works(): void
    {
        $user = User::factory()->create();

        $profile = Profile::create([
            'user_id' => $user->id,
            'headline' => 'Full Stack Engineer & Web Developer',
            'location' => 'Manila, Philippines',
            'phone' => '+63 917 123 4567',
            'bio' => 'Passionate engineer building applications.',
            'status' => 'actively_looking',
            'target_roles' => ['Full Stack Engineer', 'Frontend Developer'],
            'workplace_types' => ['Remote', 'Hybrid'],
            'employment_types' => ['Full-time', 'Contract'],
            'target_salary' => '$80,000 - $110,000 / year',
            'portfolio_url' => 'https://portfolio.dev',
            'github_url' => 'https://github.com',
            'linkedin_url' => 'https://linkedin.com',
            'custom_links' => [
                ['id' => '1', 'label' => 'Blog', 'url' => 'https://blog.dev'],
            ],
            'resume_file_name' => 'Joshua_Resume.pdf',
            'resume_file_size' => '142 KB',
            'resume_updated_at' => 'Aug 2026',
        ]);

        $this->assertInstanceOf(Profile::class, $user->profile);
        $this->assertEquals($profile->id, $user->profile->id);
        $this->assertInstanceOf(User::class, $profile->user);
        $this->assertEquals($user->id, $profile->user->id);

        $this->assertIsArray($profile->target_roles);
        $this->assertContains('Full Stack Engineer', $profile->target_roles);
        $this->assertIsArray($profile->workplace_types);
        $this->assertContains('Remote', $profile->workplace_types);
        $this->assertIsArray($profile->employment_types);
        $this->assertContains('Full-time', $profile->employment_types);
        $this->assertIsArray($profile->custom_links);
        $this->assertEquals('Blog', $profile->custom_links[0]['label']);
    }
}
