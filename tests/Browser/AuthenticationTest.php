<?php

declare(strict_types=1);

use App\Notifications\PasswordRecoveryNotification;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;

describe('Authentication', function (): void {
    describe('Login', function (): void {
        it('displays the login page correctly', function (): void {
            visit('/login')
                ->assertTitle('Login - Laravel')
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

            visit('/login')
                ->assertTitle('Login - Laravel')
                ->fill('email', 'test@example.com')
                ->fill('password', 'password')
                ->press('Sign in')
                ->assertPathIs('/territory')
                ->assertNoJavascriptErrors();

            expect(auth()->check())->toBeTrue();
            expect(auth()->user()->id)->toBe($user->id);
        });

        it('shows validation errors for invalid input', function (): void {
            // Test empty fields
            visit('/login')
                ->press('Sign in')
                ->assertSee('The email field is required.');

            // Test invalid email format
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
    });

    describe('Password Recovery', function (): void {
        it('displays the recovery page correctly', function (): void {
            visit('/recovery')
                ->assertTitle('Account Recovery - Laravel')
                ->assertSee('Account Recovery')
                ->assertSee('Enter your email address to recover your account')
                ->assertSee('Email')
                ->assertSee('Send Recovery Link')
                ->assertNoJavascriptErrors();
        });

        it('shows validation errors for invalid input', function (): void {
            // Test empty email field
            visit('/recovery')
                ->press('Send Recovery Link')
                ->assertSee('The email field is required.');

            // Test invalid email format
            visit('/recovery')
                ->fill('email', 'not-an-email')
                ->press('Send Recovery Link')
                ->assertSee('The email field must be a valid email address.');
        });

        it('handles recovery for non-existent users gracefully', function (): void {
            Notification::fake();

            visit('/recovery')
                ->fill('email', 'nonexistent@example.com')
                ->press('Send Recovery Link')
                ->assertPathIs('/recovery')
                ->assertNoJavascriptErrors();

            Notification::assertNothingSent();
        });

        it('sends recovery link to existing users', function (): void {
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
    });

    describe('Password Reset', function (): void {
        it('displays the reset password page correctly', function (): void {
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

        it('shows validation errors for invalid input', function (): void {
            $operator = createOperator();
            $user = createUser($operator, password: 'oldpassword');
            $token = Password::createToken($user);

            // Test empty password fields
            visit('/reset-password?token='.$token.'&email='.urlencode('test@example.com'))
                ->submit()
                ->assertSee('The password field is required.');

            // Test password too short
            visit('/reset-password?token='.$token.'&email='.urlencode('test@example.com'))
                ->fill('password', 'short')
                ->fill('password_confirmation', 'short')
                ->submit()
                ->assertSee('The password field must be at least 8 characters.');

            // Test password confirmation mismatch
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
    });
});
