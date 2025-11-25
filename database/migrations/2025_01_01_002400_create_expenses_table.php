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
        Schema::create('expenses', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('invoice_no');
            $table->timestamp('invoice_date')->nullable();
            $table->ulid('wholesaler_id')->nullable();
            $table->foreign('wholesaler_id')->references('id')->on('wholesalers')->cascadeOnDelete();
            $table->ulid('operator_id')->nullable();
            $table->foreign('operator_id')->references('id')->on('operators')->cascadeOnDelete();
            $table->json('pages')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });

        /* Derived data columns */
        Schema::table('expenses', function (Blueprint $table): void {
            $table->string('__wholesaler_name')->nullable()->comment('Name from the associated wholesaler record');
            $table->unsignedBigInteger('__cost')->default(0)->comment('Total cost from all expense items in this expense');
            $table->unsignedBigInteger('__rebate')->default(0)->comment('Total rebate from all expense items in this expense');
            $table->unsignedBigInteger('__royalty')->default(0)->comment('Total royalty from all expense items in this expense');
        });

        /* Performance indexes */
        Schema::table('expenses', function (Blueprint $table): void {
            $table->index('invoice_no');
            $table->index('invoice_date');
            $table->index('wholesaler_id');
            $table->index('operator_id');
            $table->index('completed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
