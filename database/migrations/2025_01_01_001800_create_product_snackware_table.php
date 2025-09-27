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
        Schema::create('product_snackware', function (Blueprint $table): void {
            $table->ulid('snackware_id');
            $table->foreign('snackware_id')->references('id')->on('snackware')->cascadeOnDelete();
            $table->ulid('product_id');
            $table->foreign('product_id')->references('id')->on('products')->cascadeOnDelete();
            $table->unique(['product_id', 'snackware_id']);
            $table->timestamps();
        });

        /* Performance indexes */
        Schema::table('product_snackware', function (Blueprint $table): void {
            $table->index('snackware_id');
            $table->index('product_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_snackware');
    }
};
