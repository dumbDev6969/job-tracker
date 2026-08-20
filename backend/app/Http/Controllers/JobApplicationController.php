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
use App\Http\Resources\CalendarEventResource;

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
            ->select(['id', 'user_id', 'company', 'role', 'status', 'applied_date', 'referral', 'created_at'])
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

    public function calendar(Request $request)
    {
        $request->validate([
            'from' => ['required', 'date'],
            'to' => ['required', 'date', 'after_or_equal:from'],
        ]);

        $from = $request->from . ' 00:00:00';
        $to = $request->to . ' 23:59:59';

        $applications = $request->user()->jobApplications()
            ->where(function ($query) use ($from, $to) {
                $query->whereBetween('interview_date', [$from, $to])
                    ->orWhereBetween('follow_up_date', [$from, $to]);
            })
            ->get(['id', 'company', 'role', 'interview_date', 'follow_up_date']);

        return CalendarEventResource::collection($applications);
    }
}
