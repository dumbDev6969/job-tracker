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
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('headline')->nullable();
            $table->string('location')->nullable();
            $table->string('phone')->nullable();
            $table->text('bio')->nullable();
            $table->string('status')->default('actively_looking');
            $table->json('target_roles')->nullable();
            $table->json('workplace_types')->nullable();
            $table->json('employment_types')->nullable();
            $table->string('target_salary')->nullable();
            $table->string('portfolio_url')->nullable();
            $table->string('github_url')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->json('custom_links')->nullable();
            $table->string('resume_path')->nullable();
            $table->string('resume_file_name')->nullable();
            $table->unsignedBigInteger('resume_file_size_bytes')->nullable();
            $table->timestamp('resume_uploaded_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
