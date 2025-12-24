<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('branch_notes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('branch_id');
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('title')->nullable();
            $table->longText('note');
            $table->enum('category', [
                'general',
                'performance',
                'disciplinary',
                'achievement',
                'other',
            ])->default('general');
            $table->boolean('is_private')->default(false);
            $table->foreign('branch_id')->references('id')->on('branches')->cascadeOnDelete();
            $table->timestamps();

            $table->index(['branch_id', 'category']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('branch_notes');
    }
};
