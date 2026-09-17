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
    Schema::create('programmes', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->enum('level', ['Diploma', 'Foundation', 'Certificate']);
        $table->string('institution');
        $table->text('entry_requirement');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('programmes');
    }
};
