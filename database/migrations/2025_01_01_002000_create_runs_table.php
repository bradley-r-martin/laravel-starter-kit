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
        Schema::create('runs', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('route_id')->nullable();
            $table->foreign('route_id')->references('id')->on('routes')->cascadeOnDelete();
            $table->ulid('operator_id');
            $table->foreign('operator_id')->references('id')->on('operators')->cascadeOnDelete();
            $table->ulid('territory_id');
            $table->foreign('territory_id')->references('id')->on('territories')->cascadeOnDelete();
            $table->string('type');
            $table->timestamp('start_at')->nullable();
            $table->timestamp('end_at');
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
        /* Derived data columns */
        Schema::table('runs', function (Blueprint $table) {
            $table->unsignedInteger('__sites_count')->default(0)->comment('Number of sites visited during this run');
            $table->unsignedBigInteger('__revenue')->default(0)->comment('Total revenue generated during this run');
            $table->unsignedBigInteger('__cash_revenue')->default(0)->comment('Total cash revenue generated during this run');
            $table->unsignedBigInteger('__card_revenue')->default(0)->comment('Total card revenue generated during this run');
            $table->unsignedBigInteger('__expected_revenue')->default(0)->comment('Expected revenue for this run based on projections');
            $table->unsignedBigInteger('__units_taken')->default(0)->comment('Total units taken during this run');
            $table->unsignedBigInteger('__shrinkage_value')->default(0)->comment('Total shrinkage value from all transactions in this run');
            $table->unsignedBigInteger('__shrinkage_percentage')->default(0)->comment('Average shrinkage percentage across all transactions in this run');
        });

        /* Performance indexes */
        Schema::table('runs', function (Blueprint $table) {
            $table->index('route_id');
            $table->index('operator_id');
            $table->index('territory_id');
            $table->index('type');
            $table->index('start_at');
            $table->index('end_at');
            $table->index('completed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('runs');
    }
};
