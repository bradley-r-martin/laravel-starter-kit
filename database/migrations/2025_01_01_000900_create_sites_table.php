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
        Schema::create('sites', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->ulid('territory_id');
            $table->foreign('territory_id')->references('id')->on('territories')->cascadeOnDelete();
            $table->ulid('operator_id');
            $table->foreign('operator_id')->references('id')->on('operators')->cascadeOnDelete();
            $table->ulid('route_id')->nullable();
            $table->foreign('route_id')->references('id')->on('routes')->cascadeOnDelete();
            $table->integer('order')->default(0);
            $table->string('name');
            $table->json('address')->nullable();
            $table->json('opening_hours')->nullable();
            $table->string('manager_code')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();
        });

        /* Derived data columns */
        Schema::table('sites', function (Blueprint $table): void {
            $table->unsignedInteger('__placements_count')->default(0)->comment('Number of placements at this site');
            $table->unsignedBigInteger('__deferred_revenue')->default(0)->comment('Total deferred revenue from all placements at this site');
            $table->unsignedBigInteger('__realised_revenue')->default(0)->comment('Total realised revenue from all placements at this site');
            $table->unsignedBigInteger('__card_revenue')->default(0)->comment('Total card revenue from all transactions at this site');
            $table->unsignedBigInteger('__cash_revenue')->default(0)->comment('Total cash revenue from all transactions at this site');
            $table->unsignedBigInteger('__stock_damaged_value')->default(0)->comment('Total value of damaged stock at this site');
            $table->unsignedBigInteger('__shrinkage_value')->default(0)->comment('Total shrinkage value from all placements at this site');
            $table->decimal('__shrinkage_percentage', 5, 2)->default(0)->comment('Average shrinkage percentage across all placements at this site');
            $table->timestamp('__next_run_at')->nullable()->comment('Scheduled time for the next run at this site');
            $table->timestamp('__last_run_at')->nullable()->comment('Timestamp of the most recent run at this site');
            $table->ulid('__last_run_id')->nullable()->comment('ID of the most recent run at this site');
            $table->string('__route_name')->nullable()->comment('Name of the route this site belongs to');
        });

        /* Performance indexes */
        Schema::table('sites', function (Blueprint $table): void {
            $table->index('territory_id');
            $table->index('operator_id');
            $table->index('route_id');
            $table->index('order');
            $table->index('name');
            $table->index('closed_at');
            $table->index('__next_run_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sites');
    }
};
