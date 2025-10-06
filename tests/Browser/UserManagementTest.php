<?php

declare(strict_types=1);

use App\Models\User;

describe('User Management', function (): void {
    describe('User List', function (): void {
        it('can view the users list', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $page = $this->as($user, $territory)->visit('/users');

            $page->assertTitle('Users - Laravel')
                ->assertSee('Users')
                ->assertSee($user->first_name)
                ->assertSee($user->last_name)
                ->assertSee($user->email)
                ->assertNoJavascriptErrors();
        });

        it('shows no users message when no users exist', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $userId = $user->id;

            $page = $this->as($user, $territory)->visit('/users');

            User::query()->where('id', $userId)->delete();

            $page = $this->as($user, $territory)->visit('/users');

            $page->assertSee('Users')
                ->assertSee('No users found')
                ->assertNoJavascriptErrors();
        });

        it('displays user status badges correctly', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $page = $this->as($user, $territory)->visit('/users');

            $page->assertSee('Active')
                ->assertNoJavascriptErrors();
        });
    });

    describe('User Creation', function (): void {
        it('can create a user', function (): void {
            ['territory' => $territory, 'user' => $user, 'operator' => $operator, 'role' => $role] = createTestEnvironment();

            $page = $this->as($user, $territory)->visit('/users/create');

            $page->assertTitle('Create User - Laravel')
                ->assertSee('Create User')
                ->assertSee('Operator')
                ->assertSee('Role')
                ->assertSee('First Name')
                ->assertSee('Last Name')
                ->assertSee('Email')
                ->assertSee('Password')
                ->assertNoJavascriptErrors();

            $page->fill('first_name', 'John')
                ->fill('last_name', 'Doe')

                ->fill('email', 'john.doe@example.com')
                ->fill('password', 'SecurePassword123!')
                ->select('operator_id', $operator->id)
                ->select('role_id', $role->id)
                ->submit()
                ->assertSee('Users')
                ->assertPathIs('/users')
                ->assertNoJavascriptErrors();

            $newUser = User::where('email', 'john.doe@example.com')->first();

            expect($newUser)->not->toBeNull();
            expect($newUser->first_name)->toBe('John');
            expect($newUser->last_name)->toBe('Doe');
            expect($newUser->email)->toBe('john.doe@example.com');
            expect($newUser->password)->not->toBe('SecurePassword123!');
            expect($newUser->password)->toStartWith('$2y$');
        })->skip('currently cannot test select fields');

        it('shows validation errors', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $page = $this->as($user, $territory)->visit('/users/create');

            $page->assertTitle('Create User - Laravel')
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

            $page = $this->as($user, $territory)->visit('/users/create');

            $page->fill('first_name', 'Test')
                ->fill('last_name', 'User')
                ->fill('email', $user->email)
                ->fill('password', 'SecurePassword123!')
                ->submit()
                ->assertSee('The email has already been taken');
        });

        it('can cancel creation', function (): void {
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
        it('can update a user', function (): void {
            ['territory' => $territory, 'user' => $user, 'operator' => $operator, 'role' => $role] = createTestEnvironment();

            $page = $this->as($user, $territory)->visit("/users/{$user->id}/update");

            $page->assertTitle('Update User - Laravel')
                ->assertSee('Update User')
                ->assertSee('Operator')
                ->assertSee('Role')
                ->assertSee('First Name')
                ->assertSee('Last Name')
                ->assertSee('Email')
                ->assertNoJavascriptErrors();

            $page->fill('first_name', 'Jane')
                ->fill('last_name', 'Smith')
                ->select('operator_id', $operator->id)
                ->select('role_id', $role->id)
                ->fill('email', 'jane.smith@example.com')
                ->submit()
                ->assertSee('Users')
                ->assertPathIs('/users')
                ->assertNoJavascriptErrors();

            $updatedUser = User::find($user->id);

            expect($updatedUser)->not->toBeNull();
            expect($updatedUser->first_name)->toBe('Jane');
            expect($updatedUser->last_name)->toBe('Smith');
            expect($updatedUser->email)->toBe('jane.smith@example.com');
        })->skip();

        it('shows validation errors on update', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $page = $this->as($user, $territory)->visit("/users/{$user->id}/update");

            $page->assertTitle('Update User - Laravel')
                ->assertNoJavascriptErrors()
                ->fill('first_name', '')
                ->fill('last_name', '')
                ->fill('email', '')
                ->submit()
                ->assertSee('The operator id field is required')
                ->assertSee('The first name field is required')
                ->assertSee('The last name field is required')
                ->assertSee('The email field is required');
        })->skip();

        it('validates email uniqueness on update excluding current user', function (): void {
            ['territory' => $territory, 'user' => $user, 'operator' => $operator, 'role' => $role] = createTestEnvironment();

            // Create another user to test uniqueness
            $anotherUser = User::create([
                'id' => (string) Illuminate\Support\Str::ulid(),
                'operator_id' => $operator->id,
                'role_id' => $role->id,
                'first_name' => 'Another',
                'last_name' => 'User',
                'email' => 'another@example.com',
                'password' => Illuminate\Support\Facades\Hash::make('password'),
                '__operator_name' => $operator->name,
            ]);

            $page = $this->as($user, $territory)->visit("/users/{$user->id}/update");

            $page->fill('email', 'another@example.com')
                ->submit()
                ->assertSee('The email has already been taken');
        })->skip();

        it('can cancel update', function (): void {
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
        })->skip();
    });

    describe('User Suspension', function (): void {
        it('can suspend a user', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $page = $this->as($user, $territory)->visit("/users/{$user->id}/suspend");

            $page->assertTitle('Suspend User: '.$user->first_name.' '.$user->last_name.' - Laravel')
                ->assertSee('Suspend User')
                ->assertSee($user->first_name)
                ->assertSee($user->last_name)
                ->assertSee($user->email)
                ->assertSee('Reason for Suspension')
                ->assertNoJavascriptErrors();

            $page->fill('reason', 'Testing suspension workflow')
                ->submit()
                ->assertSee('Users')
                ->assertPathIs('/users')
                ->assertNoJavascriptErrors();

            $suspendedUser = User::find($user->id);

            expect($suspendedUser)->not->toBeNull();
            expect($suspendedUser->suspended_at)->not->toBeNull();
        });

        it('can suspend a user with notification', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $page = $this->as($user, $territory)->visit("/users/{$user->id}/suspend");

            $page->assertTitle('Suspend User: '.$user->first_name.' '.$user->last_name.' - Laravel')
                ->assertSee('Suspend User')
                ->assertSee('Notify user via email about the suspension')
                ->assertNoJavascriptErrors();

            $page->fill('reason', 'Testing suspension with notification')
                ->check('notify')
                ->submit()
                ->assertSee('Users')
                ->assertPathIs('/users')
                ->assertNoJavascriptErrors();

            $suspendedUser = User::find($user->id);

            expect($suspendedUser)->not->toBeNull();
            expect($suspendedUser->suspended_at)->not->toBeNull();
        });

        it('shows validation errors when reason is missing', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $page = $this->as($user, $territory)->visit("/users/{$user->id}/suspend");

            $page->assertTitle('Suspend User: '.$user->first_name.' '.$user->last_name.' - Laravel')
                ->assertNoJavascriptErrors()
                ->submit()
                ->assertSee('The reason field is required');
        });

        it('can cancel suspension', function (): void {
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

        it('shows suspended badge for suspended users', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            User::query()->where('id', $user->id)->update(['suspended_at' => now()]);

            $page = $this->as($user, $territory)->visit('/users');

            $page->assertSee('Suspended')
                ->assertNoJavascriptErrors();
        });
    });

    describe('User Unsuspension', function (): void {
        it('can unsuspend a user', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            // First suspend the user
            User::query()->where('id', $user->id)->update(['suspended_at' => now()]);

            $page = $this->as($user, $territory)->visit("/users/{$user->id}/unsuspend");

            $page->assertTitle('Unsuspend User: '.$user->first_name.' '.$user->last_name.' - Laravel')
                ->assertSee('Unsuspend User')
                ->assertSee($user->first_name)
                ->assertSee($user->last_name)
                ->assertSee($user->email)
                ->assertSee('Reason for Unsuspension')
                ->assertNoJavascriptErrors();

            $page->fill('reason', 'Testing unsuspension workflow')
                ->submit()
                ->assertSee('Users')
                ->assertPathIs('/users')
                ->assertNoJavascriptErrors();

            $unsuspendedUser = User::find($user->id);

            expect($unsuspendedUser)->not->toBeNull();
            expect($unsuspendedUser->suspended_at)->toBeNull();
        });

        it('can unsuspend a user with notification', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            // First suspend the user
            User::query()->where('id', $user->id)->update(['suspended_at' => now()]);

            $page = $this->as($user, $territory)->visit("/users/{$user->id}/unsuspend");

            $page->assertTitle('Unsuspend User: '.$user->first_name.' '.$user->last_name.' - Laravel')
                ->assertSee('Unsuspend User')
                ->assertSee('Notify user via email about the unsuspension')
                ->assertNoJavascriptErrors();

            $page->fill('reason', 'Testing unsuspension with notification')
                ->check('notify')
                ->submit()
                ->assertSee('Users')
                ->assertPathIs('/users')
                ->assertNoJavascriptErrors();

            $unsuspendedUser = User::find($user->id);

            expect($unsuspendedUser)->not->toBeNull();
            expect($unsuspendedUser->suspended_at)->toBeNull();
        });

        it('shows validation errors when reason is missing', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            // First suspend the user
            User::query()->where('id', $user->id)->update(['suspended_at' => now()]);

            $page = $this->as($user, $territory)->visit("/users/{$user->id}/unsuspend");

            $page->assertTitle('Unsuspend User: '.$user->first_name.' '.$user->last_name.' - Laravel')
                ->assertNoJavascriptErrors()
                ->submit()
                ->assertSee('The reason field is required');
        });

        it('can cancel unsuspension', function (): void {
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
        it('can close a user account', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $page = $this->as($user, $territory)->visit("/users/{$user->id}/close");

            $page->assertTitle('Close User Account: '.$user->first_name.' '.$user->last_name.' - Laravel')
                ->assertSee('Close User Account')
                ->assertSee($user->first_name)
                ->assertSee($user->last_name)
                ->assertSee($user->email)
                ->assertSee('Reason for Closing')
                ->assertSee('This is typically used when a user no longer works for the company')
                ->assertNoJavascriptErrors();

            $page->fill('reason', 'Employee left company')
                ->submit()
                ->assertSee('Users')
                ->assertPathIs('/users')
                ->assertNoJavascriptErrors();

            $closedUser = User::find($user->id);

            expect($closedUser)->not->toBeNull();
            expect($closedUser->closed_at)->not->toBeNull();
        });

        it('shows validation errors when reason is missing', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $page = $this->as($user, $territory)->visit("/users/{$user->id}/close");

            $page->assertTitle('Close User Account: '.$user->first_name.' '.$user->last_name.' - Laravel')
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

        it('shows closed badge for closed users', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            User::query()->where('id', $user->id)->update(['closed_at' => now()]);

            $page = $this->as($user, $territory)->visit('/users');

            $page->assertSee('Closed')
                ->assertNoJavascriptErrors();
        });
    });

    describe('User Reopening', function (): void {
        it('can reopen a closed user account', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            // First close the user
            User::query()->where('id', $user->id)->update(['closed_at' => now()]);

            $page = $this->as($user, $territory)->visit("/users/{$user->id}/reopen");

            $page->assertTitle('Reopen User Account: '.$user->first_name.' '.$user->last_name.' - Laravel')
                ->assertSee('Reopen User Account')
                ->assertSee($user->first_name)
                ->assertSee($user->last_name)
                ->assertSee($user->email)
                ->assertSee('Reason for Reopening')
                ->assertSee('This will restore access to the user account and allow them to log in again')
                ->assertNoJavascriptErrors();

            $page->fill('reason', 'Employee returned to company')
                ->submit()
                ->assertSee('Users')
                ->assertPathIs('/users')
                ->assertNoJavascriptErrors();

            $reopenedUser = User::find($user->id);

            expect($reopenedUser)->not->toBeNull();
            expect($reopenedUser->closed_at)->toBeNull();
        });

        it('shows validation errors when reason is missing', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            // First close the user
            User::query()->where('id', $user->id)->update(['closed_at' => now()]);

            $page = $this->as($user, $territory)->visit("/users/{$user->id}/reopen");

            $page->assertTitle('Reopen User Account: '.$user->first_name.' '.$user->last_name.' - Laravel')
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

        it('shows reopen action for closed users', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            User::query()->where('id', $user->id)->update(['closed_at' => now()]);

            $page = $this->as($user, $territory)->visit('/users');

            $page->assertVisible('data-testid=user-row-'.$user->id.'-reopen')
                ->assertNoJavascriptErrors();
        });
    });

    describe('User Destruction', function (): void {
        it('can destroy a closed user account', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            // First close the user
            User::query()->where('id', $user->id)->update(['closed_at' => now()]);

            $page = $this->as($user, $territory)->visit("/users/{$user->id}/destroy");

            $page->assertTitle('Destroy User Account: '.$user->first_name.' '.$user->last_name.' - Laravel')
                ->assertSee('Destroy User Account')
                ->assertSee($user->first_name)
                ->assertSee($user->last_name)
                ->assertSee($user->email)
                ->assertSee('Reason for Destruction')
                ->assertSee('WARNING: This action is irreversible')
                ->assertNoJavascriptErrors();

            $page->fill('reason', 'Account no longer needed')
                ->submit()
                ->assertSee('Users')
                ->assertPathIs('/users')
                ->assertNoJavascriptErrors();

            // User should be deleted from database
            $destroyedUser = User::find($user->id);
            expect($destroyedUser)->toBeNull();
        });

        it('shows validation errors when reason is missing', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            // First close the user
            User::query()->where('id', $user->id)->update(['closed_at' => now()]);

            $page = $this->as($user, $territory)->visit("/users/{$user->id}/destroy");

            $page->assertTitle('Destroy User Account: '.$user->first_name.' '.$user->last_name.' - Laravel')
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

        it('shows destroy action for closed users', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            User::query()->where('id', $user->id)->update(['closed_at' => now()]);

            $page = $this->as($user, $territory)->visit('/users');

            $page->assertVisible('data-testid=user-row-'.$user->id.'-destroy')
                ->assertNoJavascriptErrors();
        });
    });

    describe('User Password Change', function (): void {
        it('can change password for another user', function (): void {
            ['territory' => $territory, 'user' => $adminUser, 'operator' => $operator] = createTestEnvironment();
            $targetUser = createUser($operator, 'Target', 'User', 'target@example.com');

            $page = $this->as($adminUser, $territory)->visit("/users/{$targetUser->id}/password");

            $page->assertTitle('Change Password: '.$targetUser->first_name.' '.$targetUser->last_name.' - Laravel')
                ->assertSee('Change Password')
                ->assertSee($targetUser->first_name)
                ->assertSee($targetUser->last_name)
                ->assertSee($targetUser->email)
                ->assertSee('New Password')
                ->assertSee('Confirm New Password')
                ->assertDontSee('Current Password') // Should not show for other users
                ->assertNoJavascriptErrors();

            $page->fill('password', 'NewSecurePassword123!')
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

            $page = $this->as($user, $territory)->visit("/users/{$user->id}/password");

            $page->assertTitle('Change Password: '.$user->first_name.' '.$user->last_name.' - Laravel')
                ->assertSee('Current Password') // Should show for own password change
                ->assertSee('New Password')
                ->assertSee('Confirm New Password')
                ->assertNoJavascriptErrors();

            $page->fill('current_password', 'wrongpassword')
                ->fill('password', 'NewSecurePassword123!')
                ->fill('password_confirmation', 'NewSecurePassword123!')
                ->submit()
                ->assertSee('The current password is incorrect')
                ->assertNoJavascriptErrors();

            // Password should not have changed
            $user->refresh();
            expect(Hash::check('NewSecurePassword123!', $user->password))->toBeFalse();
        });

        it('can change own password with correct current password', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();
            $originalPassword = 'OriginalPassword123!';
            $user->update(['password' => Hash::make($originalPassword)]);

            $page = $this->as($user, $territory)->visit("/users/{$user->id}/password");

            $page->fill('current_password', $originalPassword)
                ->fill('password', 'NewSecurePassword123!')
                ->fill('password_confirmation', 'NewSecurePassword123!')
                ->submit()
                ->assertSee('Users')
                ->assertPathIs('/users')
                ->assertNoJavascriptErrors();

            // Verify password was changed
            $user->refresh();
            expect(Hash::check('NewSecurePassword123!', $user->password))->toBeTrue();
            expect(Hash::check($originalPassword, $user->password))->toBeFalse();
        });

        it('shows validation errors for password requirements', function (): void {
            ['territory' => $territory, 'user' => $user, 'operator' => $operator] = createTestEnvironment();
            $targetUser = createUser($operator, 'Validation', 'User', 'validation@example.com');

            $page = $this->as($user, $territory)->visit("/users/{$targetUser->id}/password");

            $page->fill('password', 'short')
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

        it('shows password change action for active users', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $page = $this->as($user, $territory)->visit('/users');

            $page->assertVisible('data-testid=user-row-'.$user->id.'-password')
                ->assertNoJavascriptErrors();
        });
    });
});
