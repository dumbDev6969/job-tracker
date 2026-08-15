<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use App\Http\Requests\StoreJobApplicationRequest;
use App\Http\Requests\UpdateJobApplicationRequest;
use App\Http\Resources\JobApplicationResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class JobApplicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $jobApplications = $request->user()->jobApplications()
            ->select(['id', 'user_id', 'company', 'role', 'status', 'applied_date'])
            ->latest()
            ->paginate(10);

        return JobApplicationResource::collection($jobApplications);
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
    public function show(Request $request, JobApplication $jobApplication)
    {
        abort_if($jobApplication->user_id !== $request->user()->id, 403);

        return new JobApplicationResource($jobApplication);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateJobApplicationRequest $request, JobApplication $jobApplication)
    {
        abort_if($jobApplication->user_id !== $request->user()->id, 403);

        $validated = $request->validated();

        $jobApplication->update($validated);

        return new JobApplicationResource($jobApplication);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, JobApplication $jobApplication)
    {
        abort_if($jobApplication->user_id !== $request->user()->id, 403);

        $jobApplication->delete();

        return response()->noContent();
    }
}
