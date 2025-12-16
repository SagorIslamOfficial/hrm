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
        Schema::create('complaint_documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('complaint_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('doc_type');
            $table->string('file_path');
            $table->foreignUuid('uploaded_by')->nullable()->constrained('users')->nullOnDelete();

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
        Schema::dropIfExists('complaint_documents');
    }
};
