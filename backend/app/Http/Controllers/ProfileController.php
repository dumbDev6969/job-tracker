<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProfileRequest;
use App\Http\Requests\UploadResumeRequest;
use App\Http\Resources\Profile\ProfileResource;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    /**
     * Display the authenticated user's profile.
     */
    public function show(Request $request)
    {
        $user = $request->user();
        $profile = $user->profile ?? new Profile(['user_id' => $user->id]);
        $profile->setRelation('user', $user);

        return new ProfileResource($profile);
    }

    /**
     * Update or create the authenticated user's profile.
     */
    public function update(UpdateProfileRequest $request)
    {
        $user = $request->user();
        $validated = $request->validated();

        if (array_key_exists('full_name', $validated)) {
            $fullName = trim((string) $validated['full_name']);
            if ($fullName !== '') {
                $user->update(['name' => $fullName]);
            }
            unset($validated['full_name']);
        }

        $profile = $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            $validated
        );

        $profile->setRelation('user', $user);

        return (new ProfileResource($profile))->response()->setStatusCode(200);
    }

    /**
     * Securely upload a resume/CV document for the authenticated user.
     */
    public function uploadResume(UploadResumeRequest $request)
    {
        $user = $request->user();
        $file = $request->file('resume');

        $profile = $user->profile()->first();

        // Clean up old resume file if it exists on disk
        if ($profile && !empty($profile->resume_path) && Storage::disk('local')->exists($profile->resume_path)) {
            Storage::disk('local')->delete($profile->resume_path);
        }

        $originalName = $file->getClientOriginalName();
        $bytes = $file->getSize();

        // Store with randomized hash name inside user-scoped folder in private local disk
        $path = $file->store("resumes/{$user->id}", 'local');

        $profile = $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'resume_path' => $path,
                'resume_file_name' => $originalName,
                'resume_file_size_bytes' => $bytes,
                'resume_uploaded_at' => now(),
            ]
        );

        $profile->setRelation('user', $user);

        return (new ProfileResource($profile))->response()->setStatusCode(200);
    }

    /**
     * Download the authenticated user's uploaded resume document.
     */
    public function downloadResume(Request $request)
    {
        $user = $request->user();
        $profile = $user->profile()->first();

        if (!$profile || empty($profile->resume_path) || !Storage::disk('local')->exists($profile->resume_path)) {
            return response()->json(['message' => 'Resume not found.'], 404);
        }

        $downloadName = basename($profile->resume_file_name ?: 'Resume.pdf');
        $downloadName = preg_replace('/[^\x20-\x7E]/', '', $downloadName) ?: 'Resume.pdf';

        return Storage::disk('local')->download($profile->resume_path, $downloadName);
    }
}
