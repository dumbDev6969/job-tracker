<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\JobApplicationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ScrapeJobUrlController;

Route::post('/login', [AuthenticatedSessionController::class, 'store']);

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);

    Route::post('scrape-job-url', ScrapeJobUrlController::class)->middleware('throttle:10,1');

    Route::get('job-applications/calendar', [JobApplicationController::class, 'calendar']);

    Route::apiResource('job-applications', JobApplicationController::class);

    Route::get('profile', [ProfileController::class, 'show']);

    Route::put('profile', [ProfileController::class, 'update']);

    Route::post('profile/resume', [ProfileController::class, 'uploadResume'])->middleware('throttle:5,1');

    Route::get('profile/resume/download', [ProfileController::class, 'downloadResume']);
});

Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working',
    ]);
});
