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
        Schema::create('merchant_accounts', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('provider');
            $table->ulid('operator_id');
            $table->foreign('operator_id')->references('id')->on('operators')->cascadeOnDelete();
            $table->longText('credentials')->nullable();
            $table->timestamps();
        });

        /* Performance indexes */
        Schema::table('merchant_accounts', function (Blueprint $table) {
            $table->index('operator_id');
            $table->index('provider');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('operators');
    }
};
