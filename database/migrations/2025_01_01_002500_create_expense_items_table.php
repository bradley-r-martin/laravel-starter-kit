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
        Schema::create('expense_items', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('item')->nullable();
            $table->integer('units')->default(1);
            $table->integer('cost')->default(0);
            $table->integer('rebate')->default(0);
            $table->integer('royalty')->default(0);
            $table->integer('quantity')->default(0);
            $table->integer('price')->default(0);
            $table->ulid('product_id')->nullable();
            $table->foreign('product_id')->references('id')->on('products')->cascadeOnDelete();
            $table->ulid('expense_id');
            $table->foreign('expense_id')->references('id')->on('expenses')->cascadeOnDelete();
            $table->ulid('wholesaler_id');
            $table->foreign('wholesaler_id')->references('id')->on('wholesalers')->cascadeOnDelete();
            $table->ulid('operator_id');
            $table->foreign('operator_id')->references('id')->on('operators')->cascadeOnDelete();
            $table->timestamp('refreshed_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
        /* Derived data columns */
        Schema::table('expense_items', function (Blueprint $table) {
            $table->string('__product_name')->nullable()->comment('Name from the associated product record');
        });

        /* Performance indexes */
        Schema::table('expense_items', function (Blueprint $table) {
            $table->index('product_id');
            $table->index('expense_id');
            $table->index('wholesaler_id');
            $table->index('operator_id');
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
