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
        Schema::create('payrolls', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id');
            $table->string('name');
            $table->string('position');
            $table->string('department');
            $table->unsignedBigInteger('salary');
            $table->unsignedBigInteger('gross_salary');
            $table->unsignedBigInteger('sss');
            $table->unsignedBigInteger('pag_ibig');
            $table->unsignedBigInteger('phil_health');
            $table->unsignedBigInteger('deductions');
            $table->string('days_worked');
            $table->string('total_salary');
            $table->boolean('completed')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payrolls');
    }
};
