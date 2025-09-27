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
        Schema::create('resupplies', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->ulid('run_id');
            $table->foreign('run_id')->references('id')->on('runs')->cascadeOnDelete();
            $table->ulid('placement_id');
            $table->foreign('placement_id')->references('id')->on('placements')->cascadeOnDelete();
            $table->ulid('route_id')->nullable();
            $table->foreign('route_id')->references('id')->on('routes')->cascadeOnDelete();

            $table->ulid('territory_id');
            $table->foreign('territory_id')->references('id')->on('territories')->cascadeOnDelete();
            $table->ulid('operator_id');
            $table->foreign('operator_id')->references('id')->on('operators')->cascadeOnDelete();

            $table->ulid('site_id');
            $table->foreign('site_id')->references('id')->on('sites')->cascadeOnDelete();

            $table->ulid('snackware_id');
            $table->foreign('snackware_id')->references('id')->on('snackware')->cascadeOnDelete();

            $table->integer('stock_opening')->default(0);
            $table->integer('stock_remaining')->default(0);
            $table->integer('stock_damaged')->default(0);
            $table->integer('average_unit_price')->default(0);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
        /* Derived data columns */
        Schema::table('resupplies', function (Blueprint $table): void {
            $table->unsignedBigInteger('__revenue')->default(0)->comment('Total revenue generated from this resupply');
            $table->unsignedBigInteger('__card_revenue')->default(0)->comment('Total card revenue generated from this resupply');
            $table->unsignedBigInteger('__cash_revenue')->default(0)->comment('Total cash revenue generated from this resupply');
            $table->string('__snackware_name')->nullable()->comment('Name from the associated snackware record');
            $table->unsignedBigInteger('__units_paid_for')->default(0)->comment('Total units paid for in this resupply');
            $table->unsignedBigInteger('__shrinkage_units')->default(0)->comment('Total units lost to shrinkage in this resupply');
            $table->unsignedBigInteger('__shrinkage_value')->default(0)->comment('Total value lost to shrinkage in this resupply');
            $table->decimal('__shrinkage_percentage', 10, 2)->default(0)->comment('Percentage of units lost to shrinkage in this resupply');
        });

        /* Performance indexes */
        Schema::table('resupplies', function (Blueprint $table): void {
            $table->index('run_id');
            $table->index('placement_id');
            $table->index('route_id');
            $table->index('territory_id');
            $table->index('operator_id');
            $table->index('site_id');
            $table->index('snackware_id');
            $table->index('completed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resupplies');
    }
};
