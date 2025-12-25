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
        Schema::create('complaints', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('complaint_number')->unique();
            $table->string('title');
            $table->json('categories');
            $table->string('priority')->default('medium');
            $table->string('status')->default('draft');

            // Relationships
            $table->uuid('employee_id');
            $table->uuid('department_id')->nullable();
            $table->uuid('assigned_to')->nullable();

            // Metadata
            $table->date('incident_date');
            $table->string('incident_location')->nullable();
            $table->text('brief_description');
            $table->boolean('is_anonymous')->default(false);
            $table->boolean('is_confidential')->default(true);
            $table->boolean('is_recurring')->default(false);

            // SLA & Escalation
            $table->integer('sla_hours')->nullable();
            $table->timestamp('sla_breach_at')->nullable();
            $table->boolean('is_escalated')->default(false);
            $table->timestamp('escalated_at')->nullable();
            $table->json('escalated_to')->nullable();

            // Dates
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('acknowledged_at')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->date('due_date')->nullable();
            $table->date('follow_up_date')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Foreign keys
            $table->foreign('employee_id')->references('id')->on('employees')->cascadeOnDelete();
            $table->foreign('department_id')->references('id')->on('departments')->nullOnDelete();
            $table->foreign('assigned_to')->references('id')->on('users')->nullOnDelete();

            // Indexes
            $table->index(['status', 'priority']);
            $table->index('employee_id');
            $table->index('assigned_to');
            $table->index('submitted_at');
            $table->index('is_escalated');
            $table->index('sla_breach_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
