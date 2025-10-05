<?php

declare(strict_types=1);

use App\Models\Operator;
use App\Models\Role;
use App\Models\Territory;
use App\Models\User;

it('can create a role through the browser', function (): void {
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

    $page = $this->as($user, $territory)->visit('/roles/create');

    $page->assertTitle('Create Role - Laravel')
        ->assertSee('Create Role')
        ->assertSee('Name')
        ->assertSee('Description')
        ->assertSee('Hidden')
        ->assertNoJavascriptErrors();

    // Fill in the form
    $page
        ->fill('name', 'Administrator')
        ->fill('description', 'Full system administrator role')
        ->check('hidden');

    // Submit the form
    $page->submit()
        ->assertSee('Roles')
        ->assertPathIs('/roles')
        ->assertNoJavascriptErrors();

    // Verify the role was created in the database
    $role = Role::where('name', 'Administrator')->first();

    expect($role)->not->toBeNull();
    expect($role->name)->toBe('Administrator');
    expect($role->description)->toBe('Full system administrator role');
    expect($role->hidden)->toBeTrue();
});

it('shows validation errors', function (): void {
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

    $page = $this->as($user, $territory)->visit('/roles/create');

    $page->assertTitle('Create Role - Laravel')
        ->assertNoJavascriptErrors();

    // Try to submit without filling required fields
    $page->submit()
        ->assertSee('The name field is required');

    // Fill in invalid data (name too long)
    $page->fill('name', str_repeat('a', 256))
        ->submit()
        ->assertSee('The name field must not be greater than 255 characters');
});

it('can cancel role creation with screenshots', function (): void {
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

    $page = $this->as($user, $territory)->visit('/roles/create');

    $page->assertTitle('Create Role - Laravel')
        ->fill('name', 'Test Role')
        ->fill('description', 'This will be cancelled');

    // Click cancel button
    $page->press('Cancel')
        ->assertPathIs('/roles')
        ->assertSee('Roles')
        ->assertNoJavascriptErrors();

    // Verify the role was NOT created
    $role = Role::where('name', 'Test Role')->first();
    expect($role)->toBeNull();
});

it('can navigate between create and list pages', function (): void {
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

    // Start at list page
    $page = $this->as($user, $territory)->visit('/roles');

    $page->assertTitle('Roles - Laravel')
        ->assertSee('Roles')
        ->assertSee('Create Role');

    // Navigate to create page
    $page->press('Create Role')
        ->assertPathIs('/roles/create')
        ->assertSee('Create Role')
        ->assertSee('Back to List');

    // Navigate back to list
    $page->press('Back to List')
        ->assertPathIs('/roles')
        ->assertSee('Roles')
        ->assertNoJavascriptErrors();
});
