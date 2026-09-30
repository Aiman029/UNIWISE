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
    Schema::create('recommendations', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->foreignId('programme_id')->constrained()->onDelete('cascade');
        $table->string('session_id')->nullable()->index();
        $table->decimal('merit_score', 5, 2)->nullable();
        $table->string('dominant_trait')->nullable();
        $table->json('riasec_scores')->nullable();
        $table->json('spm_snapshot')->nullable();
        $table->timestamp('date_generated')->useCurrent();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recommendations');
    }
};
