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
        Schema::create('complaint_escalations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('complaint_id');
            $table->foreignUuid('escalated_from')->nullable()->constrained('users')->nullOnDelete();
            $table->json('escalated_to');
            $table->string('escalation_level');
            $table->text('reason');
            $table->timestamp('escalated_at');
            $table->foreignUuid('escalated_by')->constrained('users')->cascadeOnDelete();

            $table->timestamps();

            $table->foreign('complaint_id')->references('id')->on('complaints')->onDelete('cascade');

            $table->index('complaint_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaint_escalations');
    }
};
