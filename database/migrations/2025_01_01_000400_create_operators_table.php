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
        Schema::create('operators', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->string('email')->nullable();
            $table->json('address')->nullable();
            $table->json('phone')->nullable();
            $table->json('entity')->nullable();
            $table->string('image')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->timestamp('suspended_at')->nullable();
            $table->timestamps();
        });

        /* Derived data columns */
        Schema::table('operators', function (Blueprint $table) {
            $table->unsignedInteger('__territories_count')->default(0)->comment('Number of territories assigned to this operator');
            $table->timestamp('__last_transaction_at')->nullable()->comment('Timestamp of the most recent transaction for this operator');
        });

        /* Performance indexes */
        Schema::table('operators', function (Blueprint $table) {
            $table->index('name');
            $table->index('email');
            $table->index('closed_at');
            $table->index('suspended_at');
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
