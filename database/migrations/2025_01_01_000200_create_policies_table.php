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
        Schema::create('policies', function (Blueprint $table): void {
            $table->string('namespace')->primary();
            $table->string('policy')->nullable();
            $table->string('ability')->nullable();
            $table->string('description')->nullable();
            $table->boolean('hidden')->default(false);
            $table->timestamps();
        });

        /* Derived data columns */
        Schema::table('policies', function (Blueprint $table): void {
            $table->unsignedInteger('__roles_count')->default(0)->comment('Number of roles that have this policy assigned');
            $table->unsignedInteger('__users_count')->default(0)->comment('Number of users that have this policy through their roles');
        });

        /* Performance indexes */
        Schema::table('policies', function (Blueprint $table): void {
            $table->index('policy');
            $table->index('ability');
            $table->index('hidden');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('policies');
    }
};
