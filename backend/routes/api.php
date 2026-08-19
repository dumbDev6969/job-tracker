<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JobApplicationController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('job-applications/calendar', [JobApplicationController::class, 'calendar']);
    Route::apiResource('job-applications', JobApplicationController::class);
});
