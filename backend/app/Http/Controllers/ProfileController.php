<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\Profile\ProfileResource;
use App\Models\Profile;
use Illuminate\Http\Request;

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
}
