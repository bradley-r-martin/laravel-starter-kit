<?php

declare(strict_types=1);

use App\Models\Role;

it('can close a role with no users through the browser', function (): void {
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
