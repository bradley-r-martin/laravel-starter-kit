<?php

declare(strict_types=1);

use App\Aggregates\RoleAggregate;
use App\Models\Operator;
use App\Models\Role;
use App\Models\Territory;
use App\Models\User;

it('can destroy a closed role through the browser', function (): void {
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

    // Create and close a role via aggregate
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
        ->assertNoJavascriptErrors();

    // Should not show warning since role is closed
    $page->assertDontSee('This role must be closed before it can be destroyed');

    // Submit the form
    $page->submit()
        ->assertSee('Roles')
        ->assertPathIs('/roles')
        ->assertNoJavascriptErrors();

    // Verify the role was destroyed (soft deleted)
    expect(Role::find($roleId))->toBeNull();
});

it('prevents destroying a role that is not closed', function (): void {
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

    // Create a role without closing it
    $roleId = (string) Illuminate\Support\Str::ulid();
    RoleAggregate::retrieve($roleId)
        ->create('Active Manager', 'Active manager role', false)
        ->persist();

    $role = Role::findOrFail($roleId);

    $page = $this->as($user, $territory)->visit("/roles/{$roleId}/destroy");

    $page->assertTitle("Destroy Role: {$role->name} - Laravel")
        ->assertSee('Destroy Role')
        ->assertSee('Cannot Destroy Role')
        ->assertSee('This role must be closed before it can be destroyed')
        ->assertNoJavascriptErrors();

    // The submit button should be disabled
    $page->assertDisabled('button[type="submit"]');

});

it('can cancel role destruction', function (): void {
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

    // Create and close a role
    $roleId = (string) Illuminate\Support\Str::ulid();
    RoleAggregate::retrieve($roleId)
        ->create('Manager', 'Manager role', false)
        ->close('Test close')
        ->persist();

    $role = Role::findOrFail($roleId);

    $page = $this->as($user, $territory)->visit("/roles/{$roleId}/destroy");

    $page->assertTitle("Destroy Role: {$role->name} - Laravel");

    // Click cancel button
    $page->press('Cancel')
        ->assertPathIs('/roles')
        ->assertSee('Roles')
        ->assertNoJavascriptErrors();

    // Verify the role was NOT destroyed
    expect(Role::find($roleId))->not->toBeNull();
});
