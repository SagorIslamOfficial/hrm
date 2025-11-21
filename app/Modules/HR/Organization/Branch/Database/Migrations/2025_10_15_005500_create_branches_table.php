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
        Schema::create('branches', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('code')->unique();
            $table->string('type')->default('branch_office');
            $table->text('description')->nullable();

            // Hierarchy
            $table->uuid('parent_id')->nullable();
            $table->foreign('parent_id')->references('id')->on('branches')->nullOnDelete();

            // Manager
            $table->uuid('manager_id')->nullable();

            // Location
            $table->string('address_line_1')->nullable();
            $table->string('address_line_2')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('country')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('timezone')->default('Asia/Dhaka');

            // Contact
            $table->string('phone')->nullable();
            $table->string('phone_2')->nullable();
            $table->string('email')->nullable();

            // Operational
            $table->date('opening_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('status')->default('active');
            $table->integer('max_employees')->nullable();
            $table->decimal('budget', 15, 2)->nullable();
            $table->string('cost_center')->nullable();
            $table->string('tax_registration_number')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['parent_id', 'is_active']);
            $table->index('manager_id');
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('branches');
    }
};
