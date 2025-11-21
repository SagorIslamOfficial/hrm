<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('branch_details', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('branch_id');

            // GPS & Location Details
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();

            // Working Hours (JSON format)
            $table->json('working_hours')->nullable();

            // Facilities (JSON array)
            $table->json('facilities')->nullable();

            // Area & Capacity
            $table->decimal('total_area', 10, 2)->nullable();
            $table->integer('total_floors')->nullable();
            $table->string('floor_number')->nullable();

            $table->text('accessibility_features')->nullable();

            // Financial Details
            $table->decimal('monthly_rent', 12, 2)->nullable();
            $table->decimal('monthly_utilities', 12, 2)->nullable();
            $table->decimal('monthly_maintenance', 12, 2)->nullable();
            $table->decimal('security_deposit', 12, 2)->nullable();

            // Building Information
            $table->string('building_name')->nullable();
            $table->string('building_type')->nullable();
            $table->date('lease_start_date')->nullable();
            $table->date('lease_end_date')->nullable();
            $table->text('lease_terms')->nullable();

            // Contact Person (Property/Building)
            $table->string('property_contact_name')->nullable();
            $table->string('property_contact_phone')->nullable();
            $table->string('property_contact_email')->nullable();
            $table->string('property_contact_photo')->nullable();
            $table->string('property_contact_address')->nullable();

            $table->foreign('branch_id')->references('id')->on('branches')->cascadeOnDelete();
            $table->unique('branch_id');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('branch_details');
    }
};
