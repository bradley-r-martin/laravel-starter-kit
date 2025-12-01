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
        Schema::create('expense_items', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('item')->nullable();
            $table->integer('quantity')->default(1);
            $table->integer('price')->default(0);

            $table->integer('product_rebate')->default(0);
            $table->integer('product_royalty')->default(0);
            $table->integer('product_units')->default(0);
            $table->integer('product_retail_price')->default(0);

            $table->json('data')->nullable();

            $table->ulid('product_id')->nullable();
            $table->foreign('product_id')->references('id')->on('products')->cascadeOnDelete();
            $table->ulid('expense_id');
            $table->foreign('expense_id')->references('id')->on('expenses')->cascadeOnDelete();
            $table->timestamp('refreshed_at')->nullable();
            $table->timestamp('completed_at')->nullable();

            $table->timestamps();
        });
        /* Derived data columns */
        Schema::table('expense_items', function (Blueprint $table): void {
            $table->string('__product_name')->nullable()->comment('Name from the associated product record');
        });

        /* Performance indexes */
        Schema::table('expense_items', function (Blueprint $table): void {
            $table->index('product_id');
            $table->index('expense_id');
            $table->index('refreshed_at');
            $table->index('completed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expense_items');
    }
};
