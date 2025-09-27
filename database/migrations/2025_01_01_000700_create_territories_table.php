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
        Schema::create('territories', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('operator_id');
            $table->foreign('operator_id')->references('id')->on('operators')->cascadeOnDelete();
            $table->ulid('merchant_account_id')->nullable();
            $table->foreign('merchant_account_id')->references('id')->on('merchant_accounts')->cascadeOnDelete();
            $table->string('name');
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();
        });

        /* Derived data columns */
        Schema::table('territories', function (Blueprint $table) {
            $table->string('__operator_name')->nullable()->comment('Name from the associated operator record');
            $table->timestamp('__last_transaction_at')->nullable()->comment('Timestamp of the most recent transaction for this territory');
        });

        /* Performance indexes */
        Schema::table('territories', function (Blueprint $table) {
            $table->index('operator_id');
            $table->index('merchant_account_id');
            $table->index('name');
            $table->index('closed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('territories');
    }
};
