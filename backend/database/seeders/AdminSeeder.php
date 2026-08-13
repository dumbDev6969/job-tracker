<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $shouldSeedAdmin = filter_var(env('SEED_ADMIN', false), FILTER_VALIDATE_BOOLEAN);

        if (! $shouldSeedAdmin) {
            return;
        }

        $email = env('ADMIN_EMAIL');
        $name = env('ADMIN_NAME');
        $password = env('ADMIN_PASSWORD');

        if (! is_string($email) || ! is_string($name) || ! is_string($password)) {
            $this->command?->error('SEED_ADMIN is true, but ADMIN_EMAIL, ADMIN_NAME, or ADMIN_PASSWORD is missing.');
            return;
        }

        User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => $password,
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
            ]
        );
    }
}
