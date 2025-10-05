<?php

declare(strict_types=1);

use App\Aggregates\RoleAggregate;
use App\Models\Operator;
use App\Models\Role;
use App\Models\Territory;
use App\Models\User;

it('can close a role with no users through the browser', function (): void {
    $operator = Operator::create([
        'name' => 'Test Operator',
        'email' => 'operator@example.com',
    ]);

    $territory = Territory::create([
        'operator_id' => $operator->id,
        'name' => 'Test Territory',
    ]);

    $user = User::create([
        'operator_id' => $operator->id,
        'first_name' => 'Test',
        'last_name' => 'User',
        'email' => 'test@example.com',
        'password' => bcrypt('password'),
    ]);

    // Create a role via aggregate
    $roleId = (string) Illuminate\Support\Str::ulid();
    RoleAggregate::retrieve($roleId)
        ->createRole('Manager', 'Manager role', false)
        ->persist();

    $role = Role::findOrFail($roleId);

    $page = $this->as($user, $territory)->visit("/roles/{$roleId}/close");

    $page->assertTitle("Close Role: {$role->name} - Laravel")
        ->assertSee('Close Role')
        ->assertSee("You are about to close the role: {$role->name}")
        ->assertNoJavascriptErrors();

    // Should not show warning since there are no users
    $page->assertDontSee('Cannot Close Role');
    $page->assertDontSee('Please reassign all users');

    // Fill in reason
    $page->fill('reason', 'No longer needed');

    // Submit the form
    $page->submit()
        ->assertSee('Roles')
        ->assertPathIs('/roles')
        ->assertNoJavascriptErrors();

    // Verify the role was closed
    $role->refresh();
    expect($role->closed_at)->not->toBeNull();
});

it('prevents closing a role with users', function (): void {
    $operator = Operator::create([
        'name' => 'Test Operator',
        'email' => 'operator@example.com',
    ]);

    $territory = Territory::create([
        'operator_id' => $operator->id,
        'name' => 'Test Territory',
    ]);

    // Create role
    $roleToCloseId = (string) Illuminate\Support\Str::ulid();
    RoleAggregate::retrieve($roleToCloseId)
        ->createRole('Manager', 'Manager role', false)
        ->persist();

    // Create users assigned to the role
    $user1 = User::create([
        'operator_id' => $operator->id,
        'role_id' => $roleToCloseId,
        'first_name' => 'User',
        'last_name' => 'One',
        'email' => 'user1@example.com',
        'password' => bcrypt('password'),
    ]);

    $user2 = User::create([
        'operator_id' => $operator->id,
        'role_id' => $roleToCloseId,
        'first_name' => 'User',
        'last_name' => 'Two',
        'email' => 'user2@example.com',
        'password' => bcrypt('password'),
    ]);

    // Update the user count
    Role::where('id', $roleToCloseId)->update(['__users_count' => 2]);

    $roleToClose = Role::findOrFail($roleToCloseId);

    $page = $this->as($user1, $territory)->visit("/roles/{$roleToCloseId}/close");

    $page->assertTitle("Close Role: {$roleToClose->name} - Laravel")
        ->assertSee('Close Role')
        ->assertSee('Cannot Close Role')
        ->assertSee('This role has 2 users assigned')
        ->assertSee('Please reassign all users before closing this role')
        ->assertNoJavascriptErrors();

    // The submit button should be disabled
    $page->assertDisabled('button[type="submit"]');
});

it('can cancel role closure', function (): void {
    $operator = Operator::create([
        'name' => 'Test Operator',
        'email' => 'operator@example.com',
    ]);

    $territory = Territory::create([
        'operator_id' => $operator->id,
        'name' => 'Test Territory',
    ]);

    $user = User::create([
        'operator_id' => $operator->id,
        'first_name' => 'Test',
        'last_name' => 'User',
        'email' => 'test@example.com',
        'password' => bcrypt('password'),
    ]);

    // Create a role
    $roleId = (string) Illuminate\Support\Str::ulid();
    RoleAggregate::retrieve($roleId)
        ->createRole('Manager', 'Manager role', false)
        ->persist();

    $role = Role::findOrFail($roleId);

    $page = $this->as($user, $territory)->visit("/roles/{$roleId}/close");

    $page->assertTitle("Close Role: {$role->name} - Laravel")
        ->fill('reason', 'Changed my mind');

    // Click cancel button
    $page->press('Cancel')
        ->assertPathIs('/roles')
        ->assertSee('Roles')
        ->assertNoJavascriptErrors();

    // Verify the role was NOT closed
    $role->refresh();
    expect($role->closed_at)->toBeNull();
});
