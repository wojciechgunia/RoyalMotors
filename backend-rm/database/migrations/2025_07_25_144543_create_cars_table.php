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
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->unique();
            $table->string('model');
            $table->string('year_of_manufacture');
            $table->string('version');
            $table->string('type_of_vehicle');
            $table->string('color');
            $table->string('engine');
            $table->string('power');
            $table->string('transmission');
            $table->string('fuel');
            $table->integer('number_of_doors');
            $table->integer('number_of_seats');
            $table->string('other_info')->nullable();
            $table->string('image_url')->nullable();
            $table->string('3d_model_url')->nullable();
            $table->float('min_price');
            $table->foreignId('manufacturer_id')->constrained()->onDelete('cascade');
            $table->unique(['model', 'year_of_manufacture', 'version']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
