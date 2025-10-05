<?php

declare(strict_types=1);

use App\Aggregates\RoleAggregate;
use App\Models\Role;

it('can destroy a closed role through the browser', function (): void {
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
