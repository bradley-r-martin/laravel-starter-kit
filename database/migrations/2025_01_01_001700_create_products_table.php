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
        Schema::create('products', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->ulid('product_type_id');
            $table->foreign('product_type_id')->references('id')->on('product_types')->cascadeOnDelete();
            $table->ulid('manufacturer_id');
            $table->foreign('manufacturer_id')->references('id')->on('manufacturers')->cascadeOnDelete();
            $table->string('name');

            $table->string('sku')->nullable();
            $table->integer('units')->default(1);
            $table->integer('cost')->default(0);
            $table->integer('price')->default(0);
            $table->decimal('rebate', 5, 2)->default(0);
            $table->decimal('royalty', 5, 2)->default(0);
            $table->string('avatar')->nullable();

            $table->timestamp('closed_at')->nullable();
            $table->timestamps();
        });

        /* Derived data columns */
        Schema::table('products', function (Blueprint $table): void {
            $table->string('__product_type_name')->nullable()->comment('Name from the associated product_type record');
            $table->string('__manufacturer_name')->nullable()->comment('Name from the associated manufacturer record');
        });

        /* Performance indexes */
        Schema::table('products', function (Blueprint $table): void {
            $table->index('product_type_id');
            $table->index('manufacturer_id');
            $table->index('name');
            $table->index('sku');
            $table->index('closed_at');
            $table->index('price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
