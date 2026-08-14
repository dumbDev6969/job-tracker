<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('company');
            $table->string('role');
            $table->string('status')->default('applied');
            $table->date('applied_date')->nullable();
            $table->text('url')->nullable();
            $table->string('contact')->nullable();
            $table->boolean('referral')->default(false);
            $table->text('notes')->nullable();
            $table->date('follow_up_date')->nullable();
            $table->dateTime('interview_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_applications');
    }
};
