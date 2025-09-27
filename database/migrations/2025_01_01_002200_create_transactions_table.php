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
        Schema::create('transactions', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('type');
            $table->string('method');
            $table->ulid('placement_id')->nullable();
            $table->foreign('placement_id')->references('id')->on('placements')->cascadeOnDelete();

            $table->ulid('resupply_id')->nullable();
            $table->foreign('resupply_id')->references('id')->on('resupplies')->cascadeOnDelete();

            $table->ulid('customer_id')->nullable();
            $table->foreign('customer_id')->references('id')->on('customers')->cascadeOnDelete();
            $table->ulid('qr_code_id')->nullable();
            $table->foreign('qr_code_id')->references('id')->on('qr_codes')->cascadeOnDelete();

            $table->ulid('merchant_account_id')->nullable();
            $table->foreign('merchant_account_id')->references('id')->on('merchant_accounts')->cascadeOnDelete();

            $table->ulid('site_id')->nullable();
            $table->foreign('site_id')->references('id')->on('sites')->cascadeOnDelete();

            $table->ulid('snackware_id')->nullable();
            $table->foreign('snackware_id')->references('id')->on('snackware')->cascadeOnDelete();

            $table->ulid('run_id')->nullable();
            $table->foreign('run_id')->references('id')->on('runs')->cascadeOnDelete();

            $table->ulid('operator_id')->nullable();
            $table->foreign('operator_id')->references('id')->on('operators')->cascadeOnDelete();

            $table->ulid('territory_id')->nullable();
            $table->foreign('territory_id')->references('id')->on('territories')->cascadeOnDelete();

            $table->integer('amount')->default(0);
            $table->integer('merchant_fee')->default(0);
            $table->integer('units_taken')->default(0);
            $table->integer('expected_revenue')->default(0);
            $table->integer('card_revenue')->default(0);
            $table->json('details')->nullable();
            $table->timestamps();
            $table->timestamp('refunded_at')->nullable();

        });

        /* Performance indexes */
        Schema::table('transactions', function (Blueprint $table): void {
            $table->index('type');
            $table->index('method');
            $table->index('placement_id');
            $table->index('resupply_id');
            $table->index('customer_id');
            $table->index('qr_code_id');
            $table->index('merchant_account_id');
            $table->index('site_id');
            $table->index('snackware_id');
            $table->index('run_id');
            $table->index('operator_id');
            $table->index('territory_id');
            $table->index('amount');
            $table->index('refunded_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
