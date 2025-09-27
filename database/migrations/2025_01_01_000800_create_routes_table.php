<?php

declare(strict_types=1);

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
        Schema::create('routes', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('territory_id');
            $table->foreign('territory_id')->references('id')->on('territories')->cascadeOnDelete();
            $table->ulid('operator_id');
            $table->foreign('operator_id')->references('id')->on('operators')->cascadeOnDelete();
            $table->string('name');
            $table->string('schedule')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->timestamp('skipped_until')->nullable();
            $table->timestamps();
        });

        /* Derived data columns */
        Schema::table('routes', function (Blueprint $table) {
            $table->unsignedInteger('__sites_count')->default(0)->comment('Number of sites on this route');
            $table->timestamp('__next_run_at')->nullable()->comment('Scheduled time for the next run on this route');
            $table->timestamp('__last_run_at')->nullable()->comment('Timestamp of the most recent run on this route');
            $table->ulid('__last_run_id')->nullable()->comment('ID of the most recent run on this route');

            $table->decimal('__latitude', 10, 8)->nullable()->comment('Average latitude of all sites on this route');
            $table->decimal('__longitude', 11, 8)->nullable()->comment('Average longitude of all sites on this route');
            $table->unsignedInteger('__radius')->nullable()->comment('Radius in meters covering all sites on this route');

            $table->unsignedBigInteger('__deferred_revenue')->default(0)->comment('Total deferred revenue from all sites on this route');
            $table->unsignedBigInteger('__realised_revenue')->default(0)->comment('Total realised revenue from all sites on this route');
        });

        /* Performance indexes */
        Schema::table('routes', function (Blueprint $table) {
            $table->index('territory_id');
            $table->index('operator_id');
            $table->index('name');
            $table->index('closed_at');
            $table->index('skipped_until');
            $table->index('__next_run_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('routes');
    }
};
