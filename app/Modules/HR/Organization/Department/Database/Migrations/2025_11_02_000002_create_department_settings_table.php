<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('department_settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('department_id')->constrained('departments')->onDelete('cascade');
            $table->foreignUuid('branch_id')->nullable()->constrained('branches')->cascadeOnDelete();
            $table->boolean('overtime_allowed')->default(true);
            $table->boolean('travel_allowed')->default(true);
            $table->boolean('home_office_allowed')->default(true);
            $table->integer('meeting_room_count')->default(0);
            $table->integer('desk_count')->default(0);
            $table->boolean('requires_approval')->default(false);
            $table->string('approval_level')->nullable();
            $table->timestamps();

            $table->unique('department_id');
            $table->index('department_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('department_settings');
    }
};
