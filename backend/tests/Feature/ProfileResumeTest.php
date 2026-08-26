<?php

namespace Tests\Feature;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProfileResumeTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_upload_or_download_resume(): void
    {
        $uploadResponse = $this->postJson('/api/profile/resume', [
            'resume' => UploadedFile::fake()->create('resume.pdf', 500, 'application/pdf'),
        ]);
        $uploadResponse->assertUnauthorized();

        $downloadResponse = $this->getJson('/api/profile/resume/download');
        $downloadResponse->assertUnauthorized();
    }

    public function test_user_can_upload_valid_pdf_resume(): void
    {
        Storage::fake('local');

        $user = User::factory()->create();

        $file = UploadedFile::fake()->create('my_resume.pdf', 1024, 'application/pdf');

        $response = $this->actingAs($user)->postJson('/api/profile/resume', [
            'resume' => $file,
        ]);

        $response->assertOk();
        $response->assertJsonPath('data.resume_file_name', 'my_resume.pdf');
        $response->assertJsonPath('data.resume_file_size', '1.0 MB');
        $this->assertNotNull($response->json('data.resume_url'));

        $profile = Profile::where('user_id', $user->id)->first();
        $this->assertNotNull($profile);
        $this->assertNotNull($profile->resume_path);
        $this->assertEquals('my_resume.pdf', $profile->resume_file_name);

        Storage::disk('local')->assertExists($profile->resume_path);
    }

    public function test_user_can_upload_valid_docx_resume(): void
    {
        Storage::fake('local');

        $user = User::factory()->create();

        $file = UploadedFile::fake()->create(
            'cv_document.docx',
            250,
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        );

        $response = $this->actingAs($user)->postJson('/api/profile/resume', [
            'resume' => $file,
        ]);

        $response->assertOk();
        $response->assertJsonPath('data.resume_file_name', 'cv_document.docx');
        $response->assertJsonPath('data.resume_file_size', '250 KB');

        $profile = Profile::where('user_id', $user->id)->first();
        $this->assertNotNull($profile);
        Storage::disk('local')->assertExists($profile->resume_path);
    }

    public function test_upload_rejects_file_exceeding_5mb(): void
    {
        Storage::fake('local');

        $user = User::factory()->create();

        // 6MB file (6144 KB)
        $file = UploadedFile::fake()->create('large_resume.pdf', 6144, 'application/pdf');

        $response = $this->actingAs($user)->postJson('/api/profile/resume', [
            'resume' => $file,
        ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['resume']);
    }

    public function test_upload_rejects_invalid_file_extension(): void
    {
        Storage::fake('local');

        $user = User::factory()->create();

        // Executable script disguised
        $file = UploadedFile::fake()->create('malicious.exe', 100, 'application/x-msdownload');

        $response = $this->actingAs($user)->postJson('/api/profile/resume', [
            'resume' => $file,
        ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['resume']);
    }

    public function test_upload_replaces_old_resume_file(): void
    {
        Storage::fake('local');

        $user = User::factory()->create();

        // Upload first resume
        $file1 = UploadedFile::fake()->create('old_resume.pdf', 300, 'application/pdf');
        $this->actingAs($user)->postJson('/api/profile/resume', ['resume' => $file1])->assertOk();

        $profile = Profile::where('user_id', $user->id)->first();
        $oldPath = $profile->resume_path;
        Storage::disk('local')->assertExists($oldPath);

        // Upload second resume
        $file2 = UploadedFile::fake()->create('new_resume.pdf', 400, 'application/pdf');
        $this->actingAs($user)->postJson('/api/profile/resume', ['resume' => $file2])->assertOk();

        $profile->refresh();
        $newPath = $profile->resume_path;

        $this->assertNotEquals($oldPath, $newPath);
        Storage::disk('local')->assertMissing($oldPath);
        Storage::disk('local')->assertExists($newPath);
        $this->assertEquals('new_resume.pdf', $profile->resume_file_name);
    }

    public function test_user_can_download_their_resume(): void
    {
        Storage::fake('local');

        $user = User::factory()->create();

        $file = UploadedFile::fake()->create('downloadable_cv.pdf', 500, 'application/pdf');
        $this->actingAs($user)->postJson('/api/profile/resume', ['resume' => $file])->assertOk();

        $response = $this->actingAs($user)->get('/api/profile/resume/download');

        $response->assertOk();
        $response->assertDownload('downloadable_cv.pdf');
    }

    public function test_download_returns_404_if_no_resume_uploaded(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson('/api/profile/resume/download');

        $response->assertNotFound();
    }
}
