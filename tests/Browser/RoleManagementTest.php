<?php

declare(strict_types=1);

use App\Aggregates\RoleAggregate;
use App\Models\Role;

describe('Role Management', function (): void {
    describe('Role Creation', function (): void {
        it('can create a role', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $page = $this->as($user, $territory)->visit('/roles/create');

            $page->assertTitle('Create Role - Laravel')
                ->assertSee('Create Role')
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

        it('shows validation errors', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $page = $this->as($user, $territory)->visit('/roles/create');

            $page->assertTitle('Create Role - Laravel')
                ->assertNoJavascriptErrors()
                ->submit()
                ->assertSee('The name field is required')
                ->fill('name', str_repeat('a', 256))
                ->submit()
                ->assertSee('The name field must not be greater than 255 characters');
        });

        it('can cancel creation', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $this->as($user, $territory)->visit('/roles/create')
                ->fill('name', 'Test Role')
                ->fill('description', 'This will be cancelled')
                ->press('Cancel')
                ->assertPathIs('/roles')
                ->assertSee('Roles')
                ->assertNoJavascriptErrors();

            expect(Role::where('name', 'Test Role')->first())->toBeNull();
        });
    });

    describe('Role Updates', function (): void {
        it('can update a role', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();
            $role = createRole('Manager', 'Manager role', false);

            $page = $this->as($user, $territory)->visit("/roles/{$role->id}/update");

            $page->assertTitle("Update Role: {$role->name} - Laravel")
                ->assertSee('Update Role')
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

            $page = $this->as($user, $territory)->visit("/roles/{$roleId}/update");

            $page->assertTitle("Update Role: {$role->name} - Laravel")
                ->assertSee('Update Role')
                ->assertSee('Cannot Update Role')
                ->assertSee('This role is closed and cannot be updated')
                ->assertNoJavascriptErrors()
                ->assertDisabled('input[name="name"]')
                ->assertDisabled('textarea[name="description"]')
                ->assertDisabled('input[name="hidden"]')
                ->assertDisabled('button[type="submit"]');
        });

        it('shows validation errors with invalid data', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();
            $role = createRole();

            $this->as($user, $territory)->visit("/roles/{$role->id}/update")
                ->fill('name', '')
                ->fill('description', '')
                ->submit()
                ->assertSee('The name field is required')
                ->assertSee('The description field is required');
        });

        it('can cancel update', function (): void {
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

            $page = $this->as($user, $territory)->visit("/roles/{$role->id}/close");

            $page->assertTitle("Close Role: {$role->name} - Laravel")
                ->assertSee('Close Role')
                ->assertSee("You are about to close the role: {$role->name}")
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

        it('prevents closing a role with users', function (): void {
            ['operator' => $operator, 'territory' => $territory] = createTestEnvironment();

            $roleToClose = createRole();

            createUser($operator, 'User', 'One', 'user1@example.com', roleId: $roleToClose->id);
            createUser($operator, 'User', 'Two', 'user2@example.com', roleId: $roleToClose->id);

            Role::where('id', $roleToClose->id)->update(['__users_count' => 2]);
            $roleToClose->refresh();

            $authenticatedUser = createUser($operator, 'Auth', 'User', 'auth@example.com');

            $page = $this->as($authenticatedUser, $territory)->visit("/roles/{$roleToClose->id}/close");

            $page->assertTitle("Close Role: {$roleToClose->name} - Laravel")
                ->assertSee('Close Role')
                ->assertSee('Cannot Close Role')
                ->assertSee('This role has 2 users assigned')
                ->assertSee('Please reassign all users before closing this role')
                ->assertNoJavascriptErrors()
                ->assertDisabled('button[type="submit"]');
        });

        it('can cancel closure', function (): void {
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

    describe('Role Destruction', function (): void {
        it('can destroy a closed role', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $roleId = (string) Illuminate\Support\Str::ulid();
            RoleAggregate::retrieve($roleId)
                ->create('Old Manager', 'Old manager role', false)
                ->close('No longer needed')
                ->persist();

            $role = Role::findOrFail($roleId);

            $page = $this->as($user, $territory)->visit("/roles/{$roleId}/destroy");

            $page->assertTitle("Destroy Role: {$role->name} - Laravel")
                ->assertSee('Destroy Role')
                ->assertSee("You are about to destroy the role: {$role->name}")
                ->assertSee('This action is permanent and cannot be undone')
                ->assertNoJavascriptErrors()
                ->assertDontSee('This role must be closed before it can be destroyed')
                ->submit()
                ->assertSee('Roles')
                ->assertPathIs('/roles')
                ->assertNoJavascriptErrors();

            expect(Role::find($roleId))->toBeNull();
        });

        it('prevents destroying a role that is not closed', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();
            $role = createRole('Active Manager', 'Active manager role', false);

            $page = $this->as($user, $territory)->visit("/roles/{$role->id}/destroy");

            $page->assertTitle("Destroy Role: {$role->name} - Laravel")
                ->assertSee('Destroy Role')
                ->assertSee('Cannot Destroy Role')
                ->assertSee('This role must be closed before it can be destroyed')
                ->assertNoJavascriptErrors()
                ->assertDisabled('button[type="submit"]');
        });

        it('can cancel destruction', function (): void {
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
