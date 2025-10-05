<?php

declare(strict_types=1);

use App\Models\Role;

it('can create a role through the browser', function (): void {
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

it('can cancel role creation', function (): void {
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
