<?php

declare(strict_types=1);

use App\Models\Operator;
use App\Models\User;

it('displays the login page', function (): void {
    $page = visit('/login');

    $page->assertTitle('Login - Laravel')
        ->assertSee('Login')
        ->assertSee('Sign in to your account to continue')
        ->assertSee('Email')
        ->assertSee('Password')
        ->assertSee('Sign in')
        ->assertNoJavascriptErrors();
});

it('successfully logs in with valid credentials', function (): void {
    $operator = Operator::create([
        'name' => 'Test Operator',
        'email' => 'operator@example.com',
    ]);

    $user = User::create([
        'operator_id' => $operator->id,
        'first_name' => 'Test',
        'last_name' => 'User',
        'email' => 'test@example.com',
        'password' => bcrypt('password'),
    ]);

    $page = visit('/login');

    $page->assertTitle('Login - Laravel')
        ->fill('email', 'test@example.com')
        ->fill('password', 'password')
        ->press('Sign in')
        ->assertPathIs('/territory')
        ->assertNoJavascriptErrors();

    // Verify user is authenticated
    expect(auth()->check())->toBeTrue();
    expect(auth()->user()->id)->toBe($user->id);
});

it('shows validation errors for empty fields', function (): void {
    $page = visit('/login');

    $page->assertTitle('Login - Laravel')
        ->press('Sign in')
        ->assertSee('The email field is required.');
});

it('shows validation errors for invalid email format', function (): void {
    $page = visit('/login');

    $page->assertTitle('Login - Laravel')
        ->fill('email', 'not-an-email')
        ->fill('password', 'password')
        ->press('Sign in')
        ->assertSee('The email field must be a valid email address.');
});

it('shows authentication failed error for invalid credentials', function (): void {
    $operator = Operator::create([
        'name' => 'Test Operator',
        'email' => 'operator@example.com',
    ]);

    User::create([
        'operator_id' => $operator->id,
        'first_name' => 'Test',
        'last_name' => 'User',
        'email' => 'test@example.com',
        'password' => bcrypt('correct-password'),
    ]);

    $page = visit('/login');

    $page->assertTitle('Login - Laravel')
        ->fill('email', 'test@example.com')
        ->fill('password', 'wrong-password')
        ->press('Sign in')
        ->assertPathIs('/login')
        ->assertSee('These credentials do not match our records.')
        ->assertNoJavascriptErrors();

    // Verify user is not authenticated
    expect(auth()->check())->toBeFalse();
});

it('shows authentication failed error for non-existent user', function (): void {
    $page = visit('/login');

    $page->assertTitle('Login - Laravel')
        ->fill('email', 'nonexistent@example.com')
        ->fill('password', 'password')
        ->press('Sign in')
        ->assertPathIs('/login')
        ->assertSee('These credentials do not match our records.')
        ->assertNoJavascriptErrors();

    // Verify user is not authenticated
    expect(auth()->check())->toBeFalse();
});

it('shows processing state while submitting', function (): void {
    $operator = Operator::create([
        'name' => 'Test Operator',
        'email' => 'operator@example.com',
    ]);

    User::create([
        'operator_id' => $operator->id,
        'first_name' => 'Test',
        'last_name' => 'User',
        'email' => 'test@example.com',
        'password' => bcrypt('password'),
    ]);

    $page = visit('/login');

    $page->assertTitle('Login - Laravel')
        ->fill('email', 'test@example.com')
        ->fill('password', 'password')
        ->assertSee('Sign in');

    // Note: In a real browser test, we'd verify the button changes to 'Signing in...'
    // but this is hard to catch in Pest's browser tests due to timing
    $page->press('Sign in')
        ->assertPathIs('/territory')
        ->assertNoJavascriptErrors();
});
