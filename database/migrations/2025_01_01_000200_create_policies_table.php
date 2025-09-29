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
            $table->ulid('id')->primary();
            $table->ulid('role_id');
            $table->string('policy');
            $table->string('ability');
            $table->string('description');
            $table->boolean('hidden')->default(false);
            $table->timestamps();

            $table->unique(['role_id', 'policy', 'ability']);
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
        });

        /* Derived data columns */
        Schema::table('policies', function (Blueprint $table): void {
            $table->unsignedInteger('__roles_count')->default(0);
            $table->unsignedInteger('__users_count')->default(0);
        });

        /* Performance indexes */
        Schema::table('policies', function (Blueprint $table): void {
            $table->index('role_id');
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
