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
        Schema::create('product_types', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->string('short_name')->nullable();
            $table->string('avatar')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();
        });

        /* Derived data columns */
        Schema::table('product_types', function (Blueprint $table) {
            $table->unsignedBigInteger('__products_count')->default(0)->comment('Number of products of this type');
        });

        /* Performance indexes */
        Schema::table('product_types', function (Blueprint $table) {
            $table->index('name');
            $table->index('closed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_types');
    }
};
