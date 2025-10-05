<?php

declare(strict_types=1);

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
    $operator = createOperator();
    $user = createUser($operator);

    $page = visit('/login');

    $page->assertTitle('Login - Laravel')
        ->fill('email', 'test@example.com')
        ->fill('password', 'password')
        ->press('Sign in')
        ->assertPathIs('/territory')
        ->assertNoJavascriptErrors();

    expect(auth()->check())->toBeTrue();
    expect(auth()->user()->id)->toBe($user->id);
});

it('shows validation errors for empty fields', function (): void {
    visit('/login')
        ->press('Sign in')
        ->assertSee('The email field is required.');
});

it('shows validation errors for invalid email format', function (): void {
    visit('/login')
        ->fill('email', 'not-an-email')
        ->fill('password', 'password')
        ->press('Sign in')
        ->assertSee('The email field must be a valid email address.');
});

it('shows authentication failed error for invalid credentials', function (): void {
    $operator = createOperator();
    createUser($operator, password: 'correct-password');

    visit('/login')
        ->fill('email', 'test@example.com')
        ->fill('password', 'wrong-password')
        ->press('Sign in')
        ->assertPathIs('/login')
        ->assertSee('These credentials do not match our records.')
        ->assertNoJavascriptErrors();

    expect(auth()->check())->toBeFalse();
});

it('shows authentication failed error for non-existent user', function (): void {
    visit('/login')
        ->fill('email', 'nonexistent@example.com')
        ->fill('password', 'password')
        ->press('Sign in')
        ->assertPathIs('/login')
        ->assertSee('These credentials do not match our records.')
        ->assertNoJavascriptErrors();

    expect(auth()->check())->toBeFalse();
});

it('shows processing state while submitting', function (): void {
    $operator = createOperator();
    createUser($operator);

    visit('/login')
        ->fill('email', 'test@example.com')
        ->fill('password', 'password')
        ->assertSee('Sign in')
        ->press('Sign in')
        ->assertPathIs('/territory')
        ->assertNoJavascriptErrors();
});
