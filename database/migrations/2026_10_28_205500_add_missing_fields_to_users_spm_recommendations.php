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
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'status')) {
                $table->enum('status', ['active', 'deactivated'])->default('active')->after('role');
            }
            if (!Schema::hasColumn('users', 'avatar')) {
                $table->string('avatar')->nullable()->after('status');
            }
        });

        Schema::table('spm_results', function (Blueprint $table) {
            if (!Schema::hasColumn('spm_results', 'stream')) {
                $table->string('stream')->nullable()->after('user_id');
            }
        });

        Schema::table('recommendations', function (Blueprint $table) {
            if (!Schema::hasColumn('recommendations', 'session_id')) {
                $table->string('session_id')->nullable()->index()->after('programme_id');
            }
            if (!Schema::hasColumn('recommendations', 'merit_score')) {
                $table->decimal('merit_score', 5, 2)->nullable()->after('session_id');
            }
            if (!Schema::hasColumn('recommendations', 'dominant_trait')) {
                $table->string('dominant_trait')->nullable()->after('merit_score');
            }
            if (!Schema::hasColumn('recommendations', 'riasec_scores')) {
                $table->json('riasec_scores')->nullable()->after('dominant_trait');
            }
            if (!Schema::hasColumn('recommendations', 'spm_snapshot')) {
                $table->json('spm_snapshot')->nullable()->after('riasec_scores');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'avatar')) {
                $table->dropColumn('avatar');
            }
            if (Schema::hasColumn('users', 'status')) {
                $table->dropColumn('status');
            }
        });

        Schema::table('spm_results', function (Blueprint $table) {
            if (Schema::hasColumn('spm_results', 'stream')) {
                $table->dropColumn('stream');
            }
        });

        Schema::table('recommendations', function (Blueprint $table) {
            $colsToDrop = [];
            foreach (['spm_snapshot', 'riasec_scores', 'dominant_trait', 'merit_score', 'session_id'] as $col) {
                if (Schema::hasColumn('recommendations', $col)) {
                    $colsToDrop[] = $col;
                }
            }
            if (!empty($colsToDrop)) {
                $table->dropColumn($colsToDrop);
            }
        });
    }
};

