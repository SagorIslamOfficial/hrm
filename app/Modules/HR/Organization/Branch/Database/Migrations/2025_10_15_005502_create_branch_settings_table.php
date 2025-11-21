<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('branch_settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('branch_id');

            // Attendance & Leave Policies
            $table->boolean('allow_overtime')->default(true);
            $table->decimal('overtime_rate', 5, 2)->default(1.5);
            $table->boolean('allow_remote_work')->default(false);
            $table->integer('remote_work_days_per_week')->nullable();
            $table->string('standard_work_start')->nullable();
            $table->string('standard_work_end')->nullable();
            $table->integer('standard_work_hours')->default(8);

            // Leave Policies
            $table->json('leave_policies')->nullable();

            // Approval Hierarchy
            $table->json('approval_hierarchy')->nullable();

            // Operational Settings
            $table->json('security_features')->nullable();

            // Financial Settings
            $table->string('currency')->default('BDT');
            $table->string('payment_method')->nullable();
            $table->integer('salary_payment_day')->nullable();

            // Communication Settings
            $table->string('primary_language')->default('en');
            $table->json('supported_languages')->nullable();

            // Emergency Information
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->string('nearest_hospital')->nullable();
            $table->string('nearest_police_station')->nullable();

            // Custom Settings
            $table->json('custom_settings')->nullable();

            $table->foreign('branch_id')->references('id')->on('branches')->cascadeOnDelete();
            $table->unique('branch_id');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('branch_settings');
    }
};
