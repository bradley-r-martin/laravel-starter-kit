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
        Schema::create('contacts', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->ulid('operator_id');
            $table->foreign('operator_id')->references('id')->on('operators')->cascadeOnDelete();
            $table->ulid('territory_id');
            $table->foreign('territory_id')->references('id')->on('territories')->cascadeOnDelete();
            $table->ulid('site_id');
            $table->foreign('site_id')->references('id')->on('sites')->cascadeOnDelete();
            $table->string('first_name');
            $table->string('last_name')->nullable();
            $table->string('email')->nullable();
            $table->json('phone')->nullable();
            $table->string('image')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();
        });

        /* Performance indexes */
        Schema::table('contacts', function (Blueprint $table): void {
            $table->index('operator_id');
            $table->index('territory_id');
            $table->index('site_id');
            $table->index('email');
            $table->index('closed_at');
            $table->index(['first_name', 'last_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
