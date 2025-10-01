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
        Schema::dropIfExists('users');
        Schema::create('users', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->ulid('operator_id');
            $table->foreign('operator_id')->references('id')->on('operators')->cascadeOnDelete();
            $table->string('role_id')->nullable();
            $table->string('first_name');
            $table->string('last_name');
            $table->json('phone')->nullable();
            $table->json('address')->nullable();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('avatar')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->timestamp('suspended_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        /* Derived data columns */
        Schema::table('users', function (Blueprint $table): void {
            $table->string('__operator_name')->nullable()->comment('Name from the associated operator record');
            $table->timestamp('__last_login_at')->nullable()->comment('Last successful login timestamp');
            $table->string('__last_login_ip')->nullable()->comment('IP address of last login');
            $table->text('__last_login_user_agent')->nullable()->comment('User agent of last login');
        });

        /* Performance indexes */
        Schema::table('users', function (Blueprint $table): void {
            $table->index('operator_id');
            $table->index('role_id');
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
        Schema::dropIfExists('users');

        Schema::create('users', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });
    }
};
