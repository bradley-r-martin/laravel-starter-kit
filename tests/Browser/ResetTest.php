<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

it('displays the reset password page', function (): void {
    $operator = createOperator();
    $user = createUser($operator, password: 'oldpassword');
    $token = Password::createToken($user);

    visit('/reset-password?token='.$token.'&email='.urlencode('test@example.com'))
        ->assertTitle('Reset Password - Laravel')
        ->assertSee('Reset Password')
        ->assertSee('Enter your new password below')
        ->assertSee('Email')
        ->assertSee('New Password')
        ->assertSee('Confirm Password')
        ->assertNoJavascriptErrors();
});

it('shows validation errors for empty password fields', function (): void {
    $operator = createOperator();
    $user = createUser($operator, password: 'oldpassword');
    $token = Password::createToken($user);

    visit('/reset-password?token='.$token.'&email='.urlencode('test@example.com'))
        ->submit()
        ->assertSee('The password field is required.');
});

it('shows validation error for password too short', function (): void {
    $operator = createOperator();
    $user = createUser($operator, password: 'oldpassword');
    $token = Password::createToken($user);

    visit('/reset-password?token='.$token.'&email='.urlencode('test@example.com'))
        ->fill('password', 'short')
        ->fill('password_confirmation', 'short')
        ->submit()
        ->assertSee('The password field must be at least 8 characters.');
});

it('shows validation error when passwords do not match', function (): void {
    $operator = createOperator();
    $user = createUser($operator, password: 'oldpassword');
    $token = Password::createToken($user);

    visit('/reset-password?token='.$token.'&email='.urlencode('test@example.com'))
        ->fill('password', 'newpassword123')
        ->fill('password_confirmation', 'differentpassword123')
        ->submit()
        ->assertSee('The password field confirmation does not match.');
});

it('shows error for invalid or expired token', function (): void {
    $operator = createOperator();
    createUser($operator, password: 'oldpassword');

    visit('/reset-password?token=invalid-token&email='.urlencode('test@example.com'))
        ->fill('password', 'newpassword123')
        ->fill('password_confirmation', 'newpassword123')
        ->submit()
        ->assertSee('This password reset token is invalid.');
});

it('successfully resets password and redirects to login', function (): void {
    $operator = createOperator();
    $user = createUser($operator, password: 'oldpassword');
    $token = Password::createToken($user);

    visit('/reset-password?token='.$token.'&email='.urlencode('test@example.com'))
        ->fill('password', 'newpassword123')
        ->fill('password_confirmation', 'newpassword123')
        ->submit()
        ->assertPathIs('/login')
        ->assertNoJavascriptErrors();

    $user->refresh();
    expect(Hash::check('newpassword123', $user->password))->toBeTrue();
    expect(Hash::check('oldpassword', $user->password))->toBeFalse();
});
