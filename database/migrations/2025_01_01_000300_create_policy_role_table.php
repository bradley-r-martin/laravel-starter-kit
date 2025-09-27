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
        Schema::create('policy_role', function (Blueprint $table): void {
            $table->string('policy_namespace');
            $table->ulid('role_id');
            $table->timestamps();

            $table->primary(['policy_namespace', 'role_id']);
            $table->foreign('policy_namespace')->references('namespace')->on('policies')->onDelete('cascade');
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
        });

        /* Performance indexes */
        Schema::table('policy_role', function (Blueprint $table): void {
            $table->index('policy_namespace');
            $table->index('role_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('policy_role');
    }
};
