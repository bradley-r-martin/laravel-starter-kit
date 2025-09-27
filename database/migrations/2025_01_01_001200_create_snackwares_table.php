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
        Schema::create('snackware', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('territory_id');
            $table->foreign('territory_id')->references('id')->on('territories')->cascadeOnDelete();
            $table->ulid('operator_id');
            $table->foreign('operator_id')->references('id')->on('operators')->cascadeOnDelete();
            $table->string('name');
            $table->string('type')->default('box');
            $table->string('icon')->nullable();
            $table->unsignedBigInteger('price')->default(0);
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();
        });

        /* Derived data columns */
        Schema::table('snackware', function (Blueprint $table) {
            $table->unsignedInteger('__product_count')->default(0)->comment('Number of products in this snackware');
            $table->unsignedInteger('__placements_count')->default(0)->comment('Number of placements using this snackware');
            $table->unsignedBigInteger('__wholesale_from')->default(0)->comment('Minimum wholesale price for products in this snackware');
            $table->unsignedBigInteger('__wholesale_to')->default(0)->comment('Maximum wholesale price for products in this snackware');
        });

        /* Performance indexes */
        Schema::table('snackware', function (Blueprint $table) {
            $table->index('territory_id');
            $table->index('operator_id');
            $table->index('name');
            $table->index('type');
            $table->index('closed_at');
            $table->index('price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('snackware');
    }
};
