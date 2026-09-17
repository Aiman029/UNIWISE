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
    Schema::create('recommendation_rules', function (Blueprint $table) {
        $table->id();
        $table->enum('riasec_type', ['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional']);
        $table->foreignId('programme_id')->constrained()->onDelete('cascade');
        $table->string('min_grade', 5);
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recommendation_rules');
    }
};
