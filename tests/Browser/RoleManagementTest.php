<?php

declare(strict_types=1);

use App\Aggregates\RoleAggregate;
use App\Models\Role;

describe('Role Management', function (): void {
    describe('Role Creation', function (): void {
        it('can create a role successfully', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $this->as($user, $territory)->visit('/roles/create')
                ->assertTitle('Create Role - Laravel')
                ->assertSee('Create role')
                ->assertSee('Name')
                ->assertSee('Description')
                ->assertSee('Hidden')
                ->assertNoJavascriptErrors()
                ->fill('name', 'Administrator')
                ->fill('description', 'Full system administrator role')
                ->check('hidden')
                ->submit()
                ->assertSee('Roles')
                ->assertPathIs('/roles')
                ->assertNoJavascriptErrors();

            $role = Role::where('name', 'Administrator')->first();

            expect($role)->not->toBeNull();
            expect($role->name)->toBe('Administrator');
            expect($role->description)->toBe('Full system administrator role');
            expect($role->hidden)->toBeTrue();
        });

        it('shows validation errors for invalid input', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            // Test empty fields
            $this->as($user, $territory)->visit('/roles/create')
                ->assertTitle('Create Role - Laravel')
                ->assertNoJavascriptErrors()
                ->submit()
                ->assertSee('The name field is required');

            // Test name too long
            $this->as($user, $territory)->visit('/roles/create')
                ->fill('name', str_repeat('a', 256))
                ->submit()
                ->assertSee('The name field must not be greater than 255 characters');
        });

        it('can cancel role creation', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $this->as($user, $territory)->visit('/roles/create')
                ->fill('name', 'Test Role')
                ->fill('description', 'This will be cancelled')
                ->press('data-testid=cancel-action')
                ->assertPathIs('/roles')
                ->assertSee('Roles')
                ->assertNoJavascriptErrors();

            expect(Role::where('name', 'Test Role')->first())->toBeNull();
        });
    });

    describe('Role Updates', function (): void {
        it('can update an active role', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();
            $role = createRole('Manager', 'Manager role', false);

            $this->as($user, $territory)->visit("/roles/{$role->id}/update")
                ->assertTitle("Update Role: {$role->name} - Laravel")
                ->assertSee('Update role')
                ->assertNoJavascriptErrors()
                ->assertDontSee('Cannot Update Role')
                ->fill('name', 'Senior Manager')
                ->fill('description', 'Senior manager role with more responsibilities')
                ->check('hidden')
                ->submit()
                ->assertSee('Roles')
                ->assertPathIs('/roles')
                ->assertNoJavascriptErrors();

            $role->refresh();
            expect($role->name)->toBe('Senior Manager');
            expect($role->description)->toBe('Senior manager role with more responsibilities');
            expect($role->hidden)->toBeTrue();
        });

        it('prevents updating a closed role', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $roleId = (string) Illuminate\Support\Str::ulid();
            RoleAggregate::retrieve($roleId)
                ->create('Old Manager', 'Old manager role', false)
                ->close('No longer needed')
                ->persist();

            $role = Role::findOrFail($roleId);

            $this->as($user, $territory)->visit("/roles/{$roleId}/update")
                ->assertTitle("Update Role: {$role->name} - Laravel")
                ->assertSee('Update role')
                ->assertSee('Cannot Update Role')
                ->assertSee('This role is closed and cannot be updated')
                ->assertNoJavascriptErrors()
                ->assertDisabled('input[name="name"]')
                ->assertDisabled('textarea[name="description"]')
                ->assertDisabled('input[name="hidden"]')
                ->assertDisabled('button[type="submit"]');
        });

        it('shows validation errors for invalid input', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();
            $role = createRole();

            $this->as($user, $territory)->visit("/roles/{$role->id}/update")
                ->fill('name', '')
                ->fill('description', '')
                ->submit()
                ->assertSee('The name field is required')
                ->assertSee('The description field is required');
        });

        it('can cancel role update', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();
            $role = createRole();
            $originalName = $role->name;

            $this->as($user, $territory)->visit("/roles/{$role->id}/update")
                ->fill('name', 'Changed Name')
                ->press('Cancel')
                ->assertPathIs('/roles')
                ->assertSee('Roles')
                ->assertNoJavascriptErrors();

            $role->refresh();
            expect($role->name)->toBe($originalName);
        });
    });

    describe('Role Closure', function (): void {
        it('can close a role with no users', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();
            $role = createRole();

            $this->as($user, $territory)->visit("/roles/{$role->id}/close")
                ->assertTitle("Close Role: {$role->name} - Laravel")
                ->assertSee('Close role')
                ->assertSee('Deactivate role:')
                ->assertSee($role->name)
                ->assertNoJavascriptErrors()
                ->assertDontSee('Cannot Close Role')
                ->assertDontSee('Please reassign all users')
                ->fill('reason', 'No longer needed')
                ->submit()
                ->assertSee('Roles')
                ->assertPathIs('/roles')
                ->assertNoJavascriptErrors();

            $role->refresh();
            expect($role->closed_at)->not->toBeNull();
        });

        it('prevents closing a role with assigned users', function (): void {
            ['operator' => $operator, 'territory' => $territory] = createTestEnvironment();

            $roleToClose = createRole();

            createUser($operator, 'User', 'One', 'user1@example.com', roleId: $roleToClose->id);
            createUser($operator, 'User', 'Two', 'user2@example.com', roleId: $roleToClose->id);

            Role::where('id', $roleToClose->id)->update(['__users_count' => 2]);
            $roleToClose->refresh();

            $authenticatedUser = createUser($operator, 'Auth', 'User', 'auth@example.com');

            $this->as($authenticatedUser, $territory)->visit("/roles/{$roleToClose->id}/close")
                ->assertTitle("Close Role: {$roleToClose->name} - Laravel")
                ->assertSee('Close role')
                ->assertSee('Cannot Close Role')
                ->assertSee('This role has 2 users assigned')
                ->assertSee('Please reassign all users before closing this role')
                ->assertNoJavascriptErrors()
                ->assertDisabled('button[type="submit"]');
        });

        it('can cancel role closure', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();
            $role = createRole();

            $this->as($user, $territory)->visit("/roles/{$role->id}/close")
                ->fill('reason', 'Changed my mind')
                ->press('Cancel')
                ->assertPathIs('/roles')
                ->assertSee('Roles')
                ->assertNoJavascriptErrors();

            $role->refresh();
            expect($role->closed_at)->toBeNull();
        });
    });

    describe('Role Reopening', function (): void {
        it('can reopen a closed role', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $roleId = (string) Illuminate\Support\Str::ulid();
            RoleAggregate::retrieve($roleId)
                ->create('Closed Manager', 'Closed manager role', false)
                ->close('No longer needed')
                ->persist();

            $role = Role::findOrFail($roleId);

            $this->as($user, $territory)->visit("/roles/{$roleId}/reopen")
                ->assertTitle("Reopen Role: {$role->name} - Laravel")
                ->assertSee('Reopen role')
                ->assertSee('Restore role:')
                ->assertSee($role->name)
                ->assertNoJavascriptErrors()
                ->fill('reason', 'Role is needed again')
                ->submit()
                ->assertSee('Roles')
                ->assertPathIs('/roles')
                ->assertNoJavascriptErrors();

            $role->refresh();
            expect($role->closed_at)->toBeNull();
        });

        it('shows validation errors for invalid input', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $roleId = (string) Illuminate\Support\Str::ulid();
            RoleAggregate::retrieve($roleId)
                ->create('Closed Manager', 'Closed manager role', false)
                ->close('No longer needed')
                ->persist();

            $role = Role::findOrFail($roleId);

            $this->as($user, $territory)->visit("/roles/{$roleId}/reopen")
                ->submit()
                ->assertSee('The reason field is required');
        });

        it('can cancel role reopening', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $roleId = (string) Illuminate\Support\Str::ulid();
            RoleAggregate::retrieve($roleId)
                ->create('Closed Manager', 'Closed manager role', false)
                ->close('No longer needed')
                ->persist();

            $role = Role::findOrFail($roleId);

            $this->as($user, $territory)->visit("/roles/{$roleId}/reopen")
                ->fill('reason', 'Changed my mind')
                ->press('Cancel')
                ->assertPathIs('/roles')
                ->assertSee('Roles')
                ->assertNoJavascriptErrors();

            $role->refresh();
            expect($role->closed_at)->not->toBeNull();
        });

        it('shows reopen button for closed roles in the list', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $roleId = (string) Illuminate\Support\Str::ulid();
            RoleAggregate::retrieve($roleId)
                ->create('Closed Manager', 'Closed manager role', false)
                ->close('No longer needed')
                ->persist();

            $role = Role::findOrFail($roleId);

            $this->as($user, $territory)->visit('/roles')
                ->assertSee('Roles')
                ->assertSee('Closed Manager')
                ->assertSee('Closed')
                ->assertVisible("data-testid=role-row-${roleId}-reopen")
                ->assertNoJavascriptErrors();
        });
    });

    describe('Role Destruction', function (): void {
        it('can destroy a closed role', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $roleId = (string) Illuminate\Support\Str::ulid();
            RoleAggregate::retrieve($roleId)
                ->create('Old Manager', 'Old manager role', false)
                ->close('No longer needed')
                ->persist();

            $role = Role::findOrFail($roleId);

            $this->as($user, $territory)->visit("/roles/{$roleId}/destroy")
                ->assertTitle("Destroy Role: {$role->name} - Laravel")
                ->assertSee('Destroy role')
                ->assertSee('Permanently delete role:')
                ->assertSee($role->name)
                ->assertSee('This action is permanent and cannot be undone')
                ->assertNoJavascriptErrors()
                ->assertDontSee('This role must be closed before it can be destroyed')
                ->submit()
                ->assertSee('Roles')
                ->assertPathIs('/roles')
                ->assertNoJavascriptErrors();

            expect(Role::find($roleId))->toBeNull();
        });

        it('prevents destroying an active role', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();
            $role = createRole('Active Manager', 'Active manager role', false);

            $this->as($user, $territory)->visit("/roles/{$role->id}/destroy")
                ->assertTitle("Destroy Role: {$role->name} - Laravel")
                ->assertSee('Destroy role')
                ->assertSee('Cannot Destroy Role')
                ->assertSee('This role must be closed before it can be destroyed')
                ->assertNoJavascriptErrors()
                ->assertDisabled('button[type="submit"]');
        });

        it('can cancel role destruction', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $roleId = (string) Illuminate\Support\Str::ulid();
            RoleAggregate::retrieve($roleId)
                ->create('Manager', 'Manager role', false)
                ->close('Test close')
                ->persist();

            $role = Role::findOrFail($roleId);

            $this->as($user, $territory)->visit("/roles/{$roleId}/destroy")
                ->press('Cancel')
                ->assertPathIs('/roles')
                ->assertSee('Roles')
                ->assertNoJavascriptErrors();

            expect(Role::find($roleId))->not->toBeNull();
        });
    });
});
