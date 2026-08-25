<?php

namespace Database\Factories;

use App\Models\Profile;
use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\User;

/**
 * @extends Factory<Profile>
 */
class ProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'headline' => fake()->jobTitle(),
            'location' => fake()->city() . ', ' . fake()->country(),
            'phone' => fake()->phoneNumber(),
            'bio' => fake()->paragraph(),
            'status' => fake()->randomElement(['actively_looking', 'open_to_offers', 'not_looking']),
            'target_roles' => [fake()->jobTitle(), fake()->jobTitle()],
            'workplace_types' => ['Remote', 'Hybrid'],
            'employment_types' => ['Full-time'],
            'target_salary' => '$80,000 - $110,000 / year',
            'portfolio_url' => fake()->url(),
            'github_url' => fake()->url(),
            'linkedin_url' => fake()->url(),
            'resume_file_name' => 'resume.pdf',
            'resume_file_size' => '150 KB',
            'resume_updated_at' => now()->format('M Y'),
        ];
    }
}
