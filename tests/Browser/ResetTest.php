<?php

declare(strict_types=1);

use App\Models\Operator;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

it('displays the reset password page', function (): void {
    $operator = Operator::create([
        'name' => 'Test Operator',
        'email' => 'operator@example.com',
    ]);

    $user = User::create([
        'operator_id' => $operator->id,
        'first_name' => 'Test',
        'last_name' => 'User',
        'email' => 'test@example.com',
        'password' => Hash::make('oldpassword'),
    ]);

    $token = Password::createToken($user);

    $page = visit('/reset-password?token='.$token.'&email='.urlencode('test@example.com'));

    $page->assertTitle('Reset Password - Laravel')
        ->assertSee('Reset Password')
        ->assertSee('Enter your new password below')
        ->assertSee('Email')
        ->assertSee('New Password')
        ->assertSee('Confirm Password')
        ->assertNoJavascriptErrors();
});

it('shows validation errors for empty password fields', function (): void {
    $operator = Operator::create([
        'name' => 'Test Operator',
        'email' => 'operator@example.com',
    ]);

    $user = User::create([
        'operator_id' => $operator->id,
        'first_name' => 'Test',
        'last_name' => 'User',
        'email' => 'test@example.com',
        'password' => Hash::make('oldpassword'),
    ]);

    $token = Password::createToken($user);

    $page = visit('/reset-password?token='.$token.'&email='.urlencode('test@example.com'));

    $page->assertTitle('Reset Password - Laravel')
        ->submit()
        ->assertSee('The password field is required.');
});

it('shows validation error for password too short', function (): void {
    $operator = Operator::create([
        'name' => 'Test Operator',
        'email' => 'operator@example.com',
    ]);

    $user = User::create([
        'operator_id' => $operator->id,
        'first_name' => 'Test',
        'last_name' => 'User',
        'email' => 'test@example.com',
        'password' => Hash::make('oldpassword'),
    ]);

    $token = Password::createToken($user);

    $page = visit('/reset-password?token='.$token.'&email='.urlencode('test@example.com'));

    $page->assertTitle('Reset Password - Laravel')
        ->fill('password', 'short')
        ->fill('password_confirmation', 'short')
        ->submit()
        ->assertSee('The password field must be at least 8 characters.');
});

it('shows validation error when passwords do not match', function (): void {
    $operator = Operator::create([
        'name' => 'Test Operator',
        'email' => 'operator@example.com',
    ]);

    $user = User::create([
        'operator_id' => $operator->id,
        'first_name' => 'Test',
        'last_name' => 'User',
        'email' => 'test@example.com',
        'password' => Hash::make('oldpassword'),
    ]);

    $token = Password::createToken($user);

    $page = visit('/reset-password?token='.$token.'&email='.urlencode('test@example.com'));

    $page->assertTitle('Reset Password - Laravel')
        ->fill('password', 'newpassword123')
        ->fill('password_confirmation', 'differentpassword123')
        ->submit()
        ->assertSee('The password field confirmation does not match.');
});

it('shows error for invalid or expired token', function (): void {
    $operator = Operator::create([
        'name' => 'Test Operator',
        'email' => 'operator@example.com',
    ]);

    User::create([
        'operator_id' => $operator->id,
        'first_name' => 'Test',
        'last_name' => 'User',
        'email' => 'test@example.com',
        'password' => Hash::make('oldpassword'),
    ]);

    $page = visit('/reset-password?token=invalid-token&email='.urlencode('test@example.com'));

    $page->assertTitle('Reset Password - Laravel')
        ->fill('password', 'newpassword123')
        ->fill('password_confirmation', 'newpassword123')
        ->submit()
        ->assertSee('This password reset token is invalid.');
});

it('successfully resets password and redirects to login', function (): void {
    $operator = Operator::create([
        'name' => 'Test Operator',
        'email' => 'operator@example.com',
    ]);

    $user = User::create([
        'operator_id' => $operator->id,
        'first_name' => 'Test',
        'last_name' => 'User',
        'email' => 'test@example.com',
        'password' => Hash::make('oldpassword'),
    ]);

    $token = Password::createToken($user);

    $page = visit('/reset-password?token='.$token.'&email='.urlencode('test@example.com'));

    $page->assertTitle('Reset Password - Laravel')
        ->fill('password', 'newpassword123')
        ->fill('password_confirmation', 'newpassword123')
        ->submit()
        ->assertPathIs('/login')
        ->assertNoJavascriptErrors();

    // Verify the password was actually changed
    $user->refresh();
    expect(Hash::check('newpassword123', $user->password))->toBeTrue();
    expect(Hash::check('oldpassword', $user->password))->toBeFalse();
});
