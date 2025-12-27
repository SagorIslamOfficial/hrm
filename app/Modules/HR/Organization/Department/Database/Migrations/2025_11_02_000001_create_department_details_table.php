<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('department_details', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('department_id');
            $table->date('founded_date')->nullable();
            $table->string('division')->nullable();
            $table->string('cost_center')->nullable();
            $table->string('internal_code')->nullable();
            $table->string('office_phone')->nullable();

            $table->foreign('department_id')->references('id')->on('departments')->cascadeOnDelete();
            $table->unique('department_id');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('department_details');
    }
};
