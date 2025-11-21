<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('branch_department', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('branch_id');
            $table->uuid('department_id');

            // Additional pivot data
            $table->decimal('budget_allocation', 12, 2)->nullable();
            $table->boolean('is_primary')->default(true);

            $table->foreign('branch_id')->references('id')->on('branches')->cascadeOnDelete();
            $table->foreign('department_id')->references('id')->on('departments')->cascadeOnDelete();

            $table->unique(['branch_id', 'department_id']);
            $table->index('is_primary');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('branch_department');
    }
};
