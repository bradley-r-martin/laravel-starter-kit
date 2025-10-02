<?php

declare(strict_types=1);
use App\Models\Operator;
use App\Models\User;
use App\Notifications\PasswordRecoveryNotification;
use Illuminate\Support\Facades\Notification;

it('displays the recovery page', function (): void {
    $page = visit('/recovery');

    $page->assertTitle('Account Recovery - Laravel')
        ->assertSee('Account Recovery')
        ->assertSee('Enter your email address to recover your account')
        ->assertSee('Email')
        ->assertSee('Send Recovery Link')
        ->assertNoJavascriptErrors();
});

it('shows validation errors for empty email field', function (): void {
    $page = visit('/recovery');

    $page->assertTitle('Account Recovery - Laravel')
        ->press('Send Recovery Link')
        ->assertSee('The email field is required.');
});

it('shows validation errors for invalid email format', function (): void {
    $page = visit('/recovery');

    $page->assertTitle('Account Recovery - Laravel')
        ->fill('email', 'not-an-email')
        ->press('Send Recovery Link')
        ->assertSee('The email field must be a valid email address.');
});

it('accepts valid email format', function (): void {
    Notification::fake();
    $page = visit('/recovery');

    $page->assertTitle('Account Recovery - Laravel')
        ->fill('email', 'test@example.com')
        ->press('Send Recovery Link')
        ->assertPathIs('/recovery')
        ->assertNoJavascriptErrors();
    Notification::assertNothingSent();
});

it('sends a recovery link to the user', function (): void {
    Notification::fake();
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

    $page = visit('/recovery');

    $page->assertTitle('Account Recovery - Laravel')
        ->fill('email', 'test@example.com')
        ->assertSee('Send Recovery Link');

    $page->press('Send Recovery Link')
        ->assertPathIs('/recovery')
        ->assertNoJavascriptErrors();

    Notification::assertSentTo(
        [$user], PasswordRecoveryNotification::class
    );
});
