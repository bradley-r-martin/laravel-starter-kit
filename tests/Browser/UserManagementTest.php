<?php

declare(strict_types=1);

use App\Models\User;

describe('User Management', function (): void {
    describe('User List', function (): void {
        it('displays the users list correctly', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $this->as($user, $territory)->visit('/users')
                ->assertTitle('Users - Laravel')
                ->assertSee('Users')
                ->assertSee($user->first_name)
                ->assertSee($user->last_name)
                ->assertSee($user->email)
                ->assertNoJavascriptErrors();
        });

        it('shows no users message when no users exist', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $userId = $user->id;
            User::query()->where('id', $userId)->delete();

            $this->as($user, $territory)->visit('/users')
                ->assertSee('Users')
                ->assertSee('No users found')
                ->assertNoJavascriptErrors();
        });

        it('displays user status badges correctly', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $this->as($user, $territory)->visit('/users')
                ->assertSee('Active')
                ->assertNoJavascriptErrors();
        });
    });

    describe('User Creation', function (): void {
        it('displays the create user page correctly', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $this->as($user, $territory)->visit('/users/create')
                ->assertTitle('Create User - Laravel')
                ->assertSee('Create user')
                ->assertSee('Operator')
                ->assertSee('Role')
                ->assertSee('First Name')
                ->assertSee('Last Name')
                ->assertSee('Email')
                ->assertSee('Password')
                ->assertNoJavascriptErrors();
        });

        it('shows validation errors for invalid input', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $this->as($user, $territory)->visit('/users/create')
                ->assertTitle('Create User - Laravel')
                ->assertNoJavascriptErrors()
                ->submit()
                ->assertSee('The operator id field is required')
                ->assertSee('The first name field is required')
                ->assertSee('The last name field is required')
                ->assertSee('The email field is required')
                ->assertSee('The password field is required');
        });

        it('validates email uniqueness', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $this->as($user, $territory)->visit('/users/create')
                ->fill('first_name', 'Test')
                ->fill('last_name', 'User')
                ->fill('email', $user->email)
                ->fill('password', 'SecurePassword123!')
                ->submit()
                ->assertSee('The email has already been taken');
        });

        it('can cancel user creation', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $this->as($user, $territory)->visit('/users/create')
                ->fill('first_name', 'Test')
                ->fill('last_name', 'User')
                ->fill('email', 'cancel@example.com')
                ->fill('password', 'SecurePassword123!')
                ->press('Cancel')
                ->assertPathIs('/users')
                ->assertSee('Users')
                ->assertNoJavascriptErrors();
        });
    });

    describe('User Update', function (): void {
        it('displays the update user page correctly', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $this->as($user, $territory)->visit("/users/{$user->id}/update")
                ->assertTitle('Update User - Laravel')
                ->assertSee('Update user')
                ->assertSee('Edit details for:')
                ->assertSee('Role')
                ->assertSee('First Name')
                ->assertSee('Last Name')
                ->assertSee('Email')
                ->assertNoJavascriptErrors();
        });

        it('shows validation errors for invalid input', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $this->as($user, $territory)->visit("/users/{$user->id}/update")
                ->assertTitle('Update User - Laravel')
                ->assertNoJavascriptErrors()
                ->fill('first_name', '')
                ->fill('last_name', '')
                ->fill('email', '')
                ->submit()
                ->assertSee('The first name field is required')
                ->assertSee('The last name field is required')
                ->assertSee('The email field is required');
        });

        it('can cancel user update', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $originalEmail = $user->email;

            $this->as($user, $territory)->visit("/users/{$user->id}/update")
                ->fill('first_name', 'Changed')
                ->fill('last_name', 'Name')
                ->fill('email', 'changed@example.com')
                ->press('Cancel')
                ->assertPathIs('/users')
                ->assertSee('Users')
                ->assertNoJavascriptErrors();

            $unchangedUser = User::find($user->id);
            expect($unchangedUser->email)->toBe($originalEmail);
            expect($unchangedUser->first_name)->not->toBe('Changed');
        });
    });

    describe('User Suspension', function (): void {
        it('can suspend a user successfully', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $this->as($user, $territory)->visit("/users/{$user->id}/suspend")
                ->assertTitle('Suspend User: '.$user->first_name.' '.$user->last_name.' - Laravel')
                ->assertSee('Suspend user')
                ->assertSee('Temporarily restrict access for:')
                ->assertSee($user->first_name)
                ->assertSee($user->last_name)
                ->assertSee($user->email)
                ->assertSee('Reason for Suspension')
                ->assertNoJavascriptErrors()
                ->fill('reason', 'Testing suspension workflow')
                ->submit()
                ->assertSee('Users')
                ->assertPathIs('/users')
                ->assertNoJavascriptErrors();

            $suspendedUser = User::find($user->id);
            expect($suspendedUser)->not->toBeNull();
            expect($suspendedUser->suspended_at)->not->toBeNull();
        });

        it('can suspend a user with email notification', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $this->as($user, $territory)->visit("/users/{$user->id}/suspend")
                ->assertTitle('Suspend User: '.$user->first_name.' '.$user->last_name.' - Laravel')
                ->assertSee('Suspend user')
                ->assertSee('Notify user via email about the suspension')
                ->assertNoJavascriptErrors()
                ->fill('reason', 'Testing suspension with notification')
                ->check('notify')
                ->submit()
                ->assertSee('Users')
                ->assertPathIs('/users')
                ->assertNoJavascriptErrors();

            $suspendedUser = User::find($user->id);
            expect($suspendedUser)->not->toBeNull();
            expect($suspendedUser->suspended_at)->not->toBeNull();
        });

        it('shows validation errors for missing reason', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $this->as($user, $territory)->visit("/users/{$user->id}/suspend")
                ->assertTitle('Suspend User: '.$user->first_name.' '.$user->last_name.' - Laravel')
                ->assertNoJavascriptErrors()
                ->submit()
                ->assertSee('The reason field is required');
        });

        it('can cancel user suspension', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $this->as($user, $territory)->visit("/users/{$user->id}/suspend")
                ->fill('reason', 'Should not be suspended')
                ->press('Cancel')
                ->assertPathIs('/users')
                ->assertSee('Users')
                ->assertNoJavascriptErrors();

            $unchangedUser = User::find($user->id);
            expect($unchangedUser->suspended_at)->toBeNull();
        });

        it('displays suspended badge for suspended users', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            User::query()->where('id', $user->id)->update(['suspended_at' => now()]);

            $this->as($user, $territory)->visit('/users')
                ->assertSee('Suspended')
                ->assertNoJavascriptErrors();
        });
    });

    describe('User Unsuspension', function (): void {
        it('can unsuspend a user successfully', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            // First suspend the user
            User::query()->where('id', $user->id)->update(['suspended_at' => now()]);

            $this->as($user, $territory)->visit("/users/{$user->id}/unsuspend")
                ->assertTitle('Unsuspend User: '.$user->first_name.' '.$user->last_name.' - Laravel')
                ->assertSee('Unsuspend user')
                ->assertSee('Restore access for:')
                ->assertSee($user->first_name)
                ->assertSee($user->last_name)
                ->assertSee($user->email)
                ->assertSee('Reason for Unsuspension')
                ->assertNoJavascriptErrors()
                ->fill('reason', 'Testing unsuspension workflow')
                ->submit()
                ->assertSee('Users')
                ->assertPathIs('/users')
                ->assertNoJavascriptErrors();

            $unsuspendedUser = User::find($user->id);
            expect($unsuspendedUser)->not->toBeNull();
            expect($unsuspendedUser->suspended_at)->toBeNull();
        });

        it('can unsuspend a user with email notification', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            // First suspend the user
            User::query()->where('id', $user->id)->update(['suspended_at' => now()]);

            $this->as($user, $territory)->visit("/users/{$user->id}/unsuspend")
                ->assertTitle('Unsuspend User: '.$user->first_name.' '.$user->last_name.' - Laravel')
                ->assertSee('Unsuspend user')
                ->assertSee('Notify user via email about the unsuspension')
                ->assertNoJavascriptErrors()
                ->fill('reason', 'Testing unsuspension with notification')
                ->check('notify')
                ->submit()
                ->assertSee('Users')
                ->assertPathIs('/users')
                ->assertNoJavascriptErrors();

            $unsuspendedUser = User::find($user->id);
            expect($unsuspendedUser)->not->toBeNull();
            expect($unsuspendedUser->suspended_at)->toBeNull();
        });

        it('shows validation errors for missing reason', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            // First suspend the user
            User::query()->where('id', $user->id)->update(['suspended_at' => now()]);

            $this->as($user, $territory)->visit("/users/{$user->id}/unsuspend")
                ->assertTitle('Unsuspend User: '.$user->first_name.' '.$user->last_name.' - Laravel')
                ->assertNoJavascriptErrors()
                ->submit()
                ->assertSee('The reason field is required');
        });

        it('can cancel user unsuspension', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            // First suspend the user
            User::query()->where('id', $user->id)->update(['suspended_at' => now()]);

            $this->as($user, $territory)->visit("/users/{$user->id}/unsuspend")
                ->fill('reason', 'Should not be unsuspended')
                ->press('Cancel')
                ->assertPathIs('/users')
                ->assertSee('Users')
                ->assertNoJavascriptErrors();

            $stillSuspendedUser = User::find($user->id);
            expect($stillSuspendedUser->suspended_at)->not->toBeNull();
        });
    });

    describe('User Closure', function (): void {
        it('can close a user account successfully', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $this->as($user, $territory)->visit("/users/{$user->id}/close")
                ->assertTitle('Close User Account: '.$user->first_name.' '.$user->last_name.' - Laravel')
                ->assertSee('Close account')
                ->assertSee($user->first_name)
                ->assertSee($user->last_name)
                ->assertSee($user->email)
                ->assertSee('Reason for Closing')
                ->assertNoJavascriptErrors()
                ->fill('reason', 'Employee left company')
                ->submit()
                ->assertSee('Users')
                ->assertPathIs('/users')
                ->assertNoJavascriptErrors();

            $closedUser = User::find($user->id);
            expect($closedUser)->not->toBeNull();
            expect($closedUser->closed_at)->not->toBeNull();
        });

        it('shows validation errors for missing reason', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $this->as($user, $territory)->visit("/users/{$user->id}/close")
                ->assertTitle('Close User Account: '.$user->first_name.' '.$user->last_name.' - Laravel')
                ->assertNoJavascriptErrors()
                ->submit()
                ->assertSee('The reason field is required');
        });

        it('can cancel account closure', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $this->as($user, $territory)->visit("/users/{$user->id}/close")
                ->fill('reason', 'Should not be closed')
                ->press('Cancel')
                ->assertPathIs('/users')
                ->assertSee('Users')
                ->assertNoJavascriptErrors();

            $notClosedUser = User::find($user->id);
            expect($notClosedUser->closed_at)->toBeNull();
        });

        it('displays closed badge for closed users', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            User::query()->where('id', $user->id)->update(['closed_at' => now()]);

            $this->as($user, $territory)->visit('/users')
                ->assertSee('Closed')
                ->assertNoJavascriptErrors();
        });
    });

    describe('User Reopening', function (): void {
        it('can reopen a closed user account', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            // First close the user
            User::query()->where('id', $user->id)->update(['closed_at' => now()]);

            $this->as($user, $territory)->visit("/users/{$user->id}/reopen")
                ->assertTitle('Reopen User Account: '.$user->first_name.' '.$user->last_name.' - Laravel')
                ->assertSee('Reopen account')
                ->assertSee('Restore access for:')
                ->assertSee($user->first_name)
                ->assertSee($user->last_name)
                ->assertSee('Reason for Reopening')
                ->assertNoJavascriptErrors()
                ->fill('reason', 'Employee returned to company')
                ->submit()
                ->assertSee('Users')
                ->assertPathIs('/users')
                ->assertNoJavascriptErrors();

            $reopenedUser = User::find($user->id);
            expect($reopenedUser)->not->toBeNull();
            expect($reopenedUser->closed_at)->toBeNull();
        });

        it('shows validation errors for missing reason', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            // First close the user
            User::query()->where('id', $user->id)->update(['closed_at' => now()]);

            $this->as($user, $territory)->visit("/users/{$user->id}/reopen")
                ->assertTitle('Reopen User Account: '.$user->first_name.' '.$user->last_name.' - Laravel')
                ->assertNoJavascriptErrors()
                ->submit()
                ->assertSee('The reason field is required');
        });

        it('can cancel account reopening', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            // First close the user
            User::query()->where('id', $user->id)->update(['closed_at' => now()]);

            $this->as($user, $territory)->visit("/users/{$user->id}/reopen")
                ->fill('reason', 'Should not be reopened')
                ->press('Cancel')
                ->assertPathIs('/users')
                ->assertSee('Users')
                ->assertNoJavascriptErrors();

            $stillClosedUser = User::find($user->id);
            expect($stillClosedUser->closed_at)->not->toBeNull();
        });
    });

    describe('User Destruction', function (): void {
        it('can destroy a closed user account', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            // First close the user
            User::query()->where('id', $user->id)->update(['closed_at' => now()]);

            $this->as($user, $territory)->visit("/users/{$user->id}/destroy")
                ->assertTitle('Destroy User Account: '.$user->first_name.' '.$user->last_name.' - Laravel')
                ->assertSee('Destroy account')
                ->assertSee('You are about to permanently destroy the account for:')
                ->assertSee($user->first_name)
                ->assertSee($user->last_name)
                ->assertSee('Reason for Destruction')
                ->assertSee('WARNING:')
                ->assertSee('This action is irreversible')
                ->assertNoJavascriptErrors()
                ->fill('reason', 'Account no longer needed')
                ->submit()
                ->assertSee('Users')
                ->assertPathIs('/users')
                ->assertNoJavascriptErrors();

            // User should be deleted from database
            $destroyedUser = User::find($user->id);
            expect($destroyedUser)->toBeNull();
        });

        it('shows validation errors for missing reason', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            // First close the user
            User::query()->where('id', $user->id)->update(['closed_at' => now()]);

            $this->as($user, $territory)->visit("/users/{$user->id}/destroy")
                ->assertTitle('Destroy User Account: '.$user->first_name.' '.$user->last_name.' - Laravel')
                ->assertNoJavascriptErrors()
                ->submit()
                ->assertSee('The reason field is required');
        });

        it('can cancel account destruction', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            // First close the user
            User::query()->where('id', $user->id)->update(['closed_at' => now()]);

            $this->as($user, $territory)->visit("/users/{$user->id}/destroy")
                ->fill('reason', 'Should not be destroyed')
                ->press('Cancel')
                ->assertPathIs('/users')
                ->assertSee('Users')
                ->assertNoJavascriptErrors();

            // User should still exist in database
            $stillExistsUser = User::find($user->id);
            expect($stillExistsUser)->not->toBeNull();
        });
    });

    describe('User Password Change', function (): void {
        it('can change password for another user', function (): void {
            ['territory' => $territory, 'user' => $adminUser, 'operator' => $operator] = createTestEnvironment();
            $targetUser = createUser($operator, 'Target', 'User', 'target@example.com');

            $this->as($adminUser, $territory)->visit("/users/{$targetUser->id}/password")
                ->assertTitle('Change Password: '.$targetUser->first_name.' '.$targetUser->last_name.' - Laravel')
                ->assertSee('Change Password')
                ->assertSee($targetUser->first_name)
                ->assertSee($targetUser->last_name)
                ->assertSee($targetUser->email)
                ->assertSee('New Password')
                ->assertSee('Confirm New Password')
                ->assertDontSee('Current Password') // Should not show for other users
                ->assertNoJavascriptErrors()
                ->fill('password', 'NewSecurePassword123!')
                ->fill('password_confirmation', 'NewSecurePassword123!')
                ->submit()
                ->assertSee('Users')
                ->assertPathIs('/users')
                ->assertNoJavascriptErrors();

            // Verify password was changed
            $targetUser->refresh();
            expect(Hash::check('NewSecurePassword123!', $targetUser->password))->toBeTrue();
        });

        it('requires current password when changing own password', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $this->as($user, $territory)->visit("/users/{$user->id}/password")
                ->assertTitle('Change Password: '.$user->first_name.' '.$user->last_name.' - Laravel')
                ->assertSee('Current Password') // Should show for own password change
                ->assertSee('New Password')
                ->assertSee('Confirm New Password')
                ->assertNoJavascriptErrors()
                ->fill('current_password', 'wrongpassword')
                ->fill('password', 'NewSecurePassword123!')
                ->fill('password_confirmation', 'NewSecurePassword123!')
                ->submit()
                ->assertSee('The current password is incorrect')
                ->assertNoJavascriptErrors();

            // Password should not have changed
            $user->refresh();
            expect(Hash::check('NewSecurePassword123!', $user->password))->toBeFalse();
        });

        it('shows validation errors for password requirements', function (): void {
            ['territory' => $territory, 'user' => $user, 'operator' => $operator] = createTestEnvironment();
            $targetUser = createUser($operator, 'Validation', 'User', 'validation@example.com');

            $this->as($user, $territory)->visit("/users/{$targetUser->id}/password")
                ->fill('password', 'short')
                ->fill('password_confirmation', 'different')
                ->submit()
                ->assertSee('The password field must be at least 8 characters')
                ->assertNoJavascriptErrors();
        });

        it('can cancel password change', function (): void {
            ['territory' => $territory, 'user' => $user, 'operator' => $operator] = createTestEnvironment();
            $targetUser = createUser($operator, 'Cancel', 'User', 'cancel@example.com');
            $originalPassword = $targetUser->password;

            $this->as($user, $territory)->visit("/users/{$targetUser->id}/password")
                ->fill('password', 'NewPassword123!')
                ->fill('password_confirmation', 'NewPassword123!')
                ->press('Cancel')
                ->assertPathIs('/users')
                ->assertSee('Users')
                ->assertNoJavascriptErrors();

            // Password should not have changed
            $targetUser->refresh();
            expect($targetUser->password)->toBe($originalPassword);
        });
    });
});
