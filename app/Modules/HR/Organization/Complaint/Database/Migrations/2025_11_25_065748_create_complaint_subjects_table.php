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
        Schema::create('complaint_subjects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('complaint_id');
            $table->uuid('subject_id');
            $table->string('subject_type');
            $table->string('relationship_to_complainant')->nullable();
            $table->text('specific_issue');
            $table->boolean('is_primary')->default(false);

            // Detail fields
            $table->text('desired_outcome')->nullable();
            $table->json('witnesses')->nullable();
            $table->boolean('previous_attempts_to_resolve')->default(false);
            $table->text('previous_resolution_attempts')->nullable();

            $table->timestamps();

            $table->foreign('complaint_id')->references('id')->on('complaints')->onDelete('cascade');

            // Indexes
            $table->index('complaint_id');
            $table->index(['subject_id', 'subject_type']);
            $table->unique(['complaint_id', 'subject_id', 'subject_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaint_subjects');
    }
};
