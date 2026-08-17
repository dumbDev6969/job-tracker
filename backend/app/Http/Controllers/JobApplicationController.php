<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use App\Http\Requests\StoreJobApplicationRequest;
use App\Http\Requests\UpdateJobApplicationRequest;
use App\Http\Resources\JobApplication\JobApplicationResource;
use App\Http\Resources\JobApplication\JobApplicationListResource;
use Illuminate\Http\Request;
use App\Policies\JobApplicationPolicy;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

#[UsePolicy(JobApplicationPolicy::class)]
class JobApplicationController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $jobApplications = $request->user()->jobApplications()
            ->select(['id', 'user_id', 'company', 'role', 'status', 'applied_date', 'referral'])
            ->latest()
            ->paginate(10);

        return JobApplicationListResource::collection($jobApplications);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreJobApplicationRequest $request)
    {
        $validated = $request->validated();

        $jobApplication = $request->user()->jobApplications()->create($validated);

        return new JobApplicationResource($jobApplication);
    }

    /**
     * Display the specified resource.
     */
    public function show(JobApplication $jobApplication)
    {
        $this->authorize('view', $jobApplication);

        return new JobApplicationResource($jobApplication);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateJobApplicationRequest $request, JobApplication $jobApplication)
    {
        $this->authorize('update', $jobApplication);

        $validated = $request->validated();

        $jobApplication->update($validated);

        return new JobApplicationResource($jobApplication);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, JobApplication $jobApplication)
    {
        $this->authorize('delete', $jobApplication);

        $jobApplication->delete();

        return response()->noContent();
    }
}


