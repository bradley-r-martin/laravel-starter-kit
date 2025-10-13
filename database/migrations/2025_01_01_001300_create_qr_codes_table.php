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
        Schema::create('qr_codes', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('code')->nullable()->unique();

            $table->ulid('operator_id');
            $table->foreign('operator_id')->references('id')->on('operators')->cascadeOnDelete();

            $table->ulid('placement_id')->nullable();
            // $table->foreign('placement_id')->references('id')->on('placements')->cascadeOnDelete();
            // cannot be linked yet.

            $table->timestamp('last_printed_at')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();
        });

        /* Derived data columns */
        Schema::table('qr_codes', function (Blueprint $table): void {
            $table->unsignedBigInteger('__deferred_revenue')->default(0)->comment('Total deferred revenue from all transactions for this QR code');
            $table->unsignedBigInteger('__realised_revenue')->default(0)->comment('Total realised revenue from all transactions for this QR code');
            $table->timestamp('__last_transaction_at')->nullable()->comment('Timestamp of the most recent transaction for this QR code');
            $table->string('__site_name')->nullable()->comment('Name from the associated site record');
            $table->string('__site_id')->nullable()->comment('ID from the associated site record');
        });

        /* Performance indexes */
        Schema::table('qr_codes', function (Blueprint $table): void {
            $table->index('code');
            $table->index('operator_id');
            $table->index('placement_id');
            $table->index('last_printed_at');
            $table->index('closed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('qr_codes');
    }
};
