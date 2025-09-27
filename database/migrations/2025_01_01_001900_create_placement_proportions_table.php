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
        Schema::create('placement_proportions', function (Blueprint $table) {
            $table->ulid('placement_id');
            $table->foreign('placement_id')->references('id')->on('placements')->cascadeOnDelete();
            $table->ulid('product_type_id');
            $table->foreign('product_type_id')->references('id')->on('product_types')->cascadeOnDelete();
            $table->unsignedInteger('proportion');
            $table->timestamps();
        });

        /* Performance indexes */
        Schema::table('placement_proportions', function (Blueprint $table) {
            $table->index('placement_id');
            $table->index('product_type_id');
            $table->index('proportion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('placement_proportions');
    }
};
