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
        Schema::table('riasec_questions', function (Blueprint $table) {
            if (!Schema::hasColumn('riasec_questions', 'question_number')) {
                $table->unsignedSmallInteger('question_number')->nullable()->unique()->after('id');
            }
            if (!Schema::hasColumn('riasec_questions', 'section')) {
                $table->string('section', 1)->nullable()->after('question_number');
            }
            if (!Schema::hasColumn('riasec_questions', 'cluster_index')) {
                $table->unsignedTinyInteger('cluster_index')->nullable()->after('section');
            }
            if (!Schema::hasColumn('riasec_questions', 'cluster_code')) {
                $table->string('cluster_code', 10)->nullable()->index()->after('cluster_index');
            }
            if (!Schema::hasColumn('riasec_questions', 'cluster_name')) {
                $table->string('cluster_name', 100)->nullable()->after('cluster_code');
            }
            if (!Schema::hasColumn('riasec_questions', 'holland_code')) {
                $table->string('holland_code', 1)->nullable()->after('cluster_name');
            }
        });

        Schema::table('recommendations', function (Blueprint $table) {
            if (!Schema::hasColumn('recommendations', 'imks_result')) {
                $table->json('imks_result')->nullable()->after('riasec_scores');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('riasec_questions', function (Blueprint $table) {
            $cols = array_values(array_filter(
                ['question_number', 'section', 'cluster_index', 'cluster_code', 'cluster_name', 'holland_code'],
                fn (string $col) => Schema::hasColumn('riasec_questions', $col)
            ));
            if (!empty($cols)) {
                $table->dropColumn($cols);
            }
        });

        Schema::table('recommendations', function (Blueprint $table) {
            if (Schema::hasColumn('recommendations', 'imks_result')) {
                $table->dropColumn('imks_result');
            }
        });
    }
};
