<?php

declare(strict_types=1);

use App\Notifications\PasswordRecoveryNotification;
use Illuminate\Support\Facades\Notification;

it('displays the recovery page', function (): void {
    visit('/recovery')
        ->assertTitle('Account Recovery - Laravel')
        ->assertSee('Account Recovery')
        ->assertSee('Enter your email address to recover your account')
        ->assertSee('Email')
        ->assertSee('Send Recovery Link')
        ->assertNoJavascriptErrors();
});

it('shows validation errors for empty email field', function (): void {
    visit('/recovery')
        ->press('Send Recovery Link')
        ->assertSee('The email field is required.');
});

it('shows validation errors for invalid email format', function (): void {
    visit('/recovery')
        ->fill('email', 'not-an-email')
        ->press('Send Recovery Link')
        ->assertSee('The email field must be a valid email address.');
});

it('accepts valid email format', function (): void {
    Notification::fake();

    visit('/recovery')
        ->fill('email', 'test@example.com')
        ->press('Send Recovery Link')
        ->assertPathIs('/recovery')
        ->assertNoJavascriptErrors();

    Notification::assertNothingSent();
});

it('sends a recovery link to the user', function (): void {
    Notification::fake();

    $operator = createOperator();
    $user = createUser($operator);

    visit('/recovery')
        ->fill('email', 'test@example.com')
        ->press('Send Recovery Link')
        ->assertPathIs('/recovery')
        ->assertNoJavascriptErrors();

    Notification::assertSentTo([$user], PasswordRecoveryNotification::class);
});
