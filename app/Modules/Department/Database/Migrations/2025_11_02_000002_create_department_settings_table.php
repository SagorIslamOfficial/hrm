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
            $table->uuid('department_id');
            $table->boolean('overtime_allowed')->default(false);
            $table->boolean('travel_allowed')->default(false);
            $table->boolean('home_office_allowed')->default(false);
            $table->integer('meeting_room_count')->nullable();
            $table->integer('desk_count')->nullable();
            $table->boolean('requires_approval')->default(false);
            $table->string('approval_level')->nullable();

            $table->foreign('department_id')->references('id')->on('departments')->cascadeOnDelete();
            $table->unique('department_id');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('department_settings');
    }
};
