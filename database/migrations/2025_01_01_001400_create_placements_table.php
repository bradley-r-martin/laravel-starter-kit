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
        Schema::create('placements', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('site_id');
            $table->foreign('site_id')->references('id')->on('sites')->cascadeOnDelete();
            $table->ulid('operator_id');
            $table->foreign('operator_id')->references('id')->on('operators')->cascadeOnDelete();
            $table->ulid('territory_id');
            $table->foreign('territory_id')->references('id')->on('territories')->cascadeOnDelete();
            $table->ulid('snackware_id');
            $table->foreign('snackware_id')->references('id')->on('snackware')->cascadeOnDelete();

            $table->ulid('qr_code_id')->nullable();
            $table->foreign('qr_code_id')->references('id')->on('qr_codes')->cascadeOnDelete();

            $table->string('location')->nullable();
            $table->longText('note')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();
        });

        /* Derived data columns */
        Schema::table('placements', function (Blueprint $table) {
            $table->unsignedInteger('__unit_count')->default(0)->comment('Total number of units in this placement');
            $table->string('__qr_code_code')->nullable()->comment('QR code from the associated qr_code record');
            $table->string('__snackware_name')->nullable()->comment('Name from the associated snackware record');
            $table->unsignedBigInteger('__expected_revenue')->default(0)->comment('Total expected revenue for this placement based on units taken and the snackware price.');
            $table->unsignedBigInteger('__deferred_revenue')->default(0)->comment('Total deferred revenue from all transactions for this placement');
            $table->unsignedBigInteger('__realised_revenue')->default(0)->comment('Total realised revenue from all transactions for this placement');
            $table->unsignedBigInteger('__shrinkage_value')->default(0)->comment('Total shrinkage value from all transactions for this placement');
            $table->decimal('__shrinkage_percentage', 5, 2)->default(0)->comment('Average shrinkage percentage from all transactions for this placement');
        });

        /* Performance indexes */
        Schema::table('placements', function (Blueprint $table) {
            $table->index('site_id');
            $table->index('operator_id');
            $table->index('territory_id');
            $table->index('snackware_id');
            $table->index('qr_code_id');
            $table->index('closed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('placements');
    }
};
