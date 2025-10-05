<?php

declare(strict_types=1);

use App\Aggregates\RoleAggregate;
use App\Models\Role;

it('can update a role through the browser', function (): void {
    ['territory' => $territory, 'user' => $user] = createTestEnvironment();
    $roleId = createRole('Manager', 'Manager role', false);
    $role = Role::findOrFail($roleId);

    $page = $this->as($user, $territory)->visit("/roles/{$roleId}/update");

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

it('shows validation errors when updating with invalid data', function (): void {
    ['territory' => $territory, 'user' => $user] = createTestEnvironment();
    $roleId = createRole();

    $this->as($user, $territory)->visit("/roles/{$roleId}/update")
        ->fill('name', '')
        ->fill('description', '')
        ->submit()
        ->assertSee('The name field is required')
        ->assertSee('The description field is required');
});

it('can cancel role update', function (): void {
    ['territory' => $territory, 'user' => $user] = createTestEnvironment();
    $roleId = createRole();
    $role = Role::findOrFail($roleId);
    $originalName = $role->name;

    $this->as($user, $territory)->visit("/roles/{$roleId}/update")
        ->fill('name', 'Changed Name')
        ->press('Cancel')
        ->assertPathIs('/roles')
        ->assertSee('Roles')
        ->assertNoJavascriptErrors();

    $role->refresh();
    expect($role->name)->toBe($originalName);
});
