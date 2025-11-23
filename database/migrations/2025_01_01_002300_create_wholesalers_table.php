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
        Schema::create('wholesalers', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();
        });

        /* Derived data columns */
        Schema::table('wholesalers', function (Blueprint $table): void {
            $table->unsignedInteger('__expenses_count')->default(0)->comment('Number of expenses from this wholesaler');
        });

        /* Performance indexes */
        Schema::table('wholesalers', function (Blueprint $table): void {
            $table->index('name');
            $table->index('closed_at');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wholesalers');
    }
};
