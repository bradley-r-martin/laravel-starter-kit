<?php

declare(strict_types=1);

use App\Aggregates\RoleAggregate;
use App\Models\Operator;
use App\Models\Role;
use App\Models\Territory;
use App\Models\User;

it('can update a role through the browser', function (): void {
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
        ->create('Manager', 'Manager role', false)
        ->persist();

    $role = Role::findOrFail($roleId);

    $page = $this->as($user, $territory)->visit("/roles/{$roleId}/update");

    $page->assertTitle("Update Role: {$role->name} - Laravel")
        ->assertSee('Update Role')
        ->assertNoJavascriptErrors();

    // Should not show warning since role is not closed
    $page->assertDontSee('Cannot Update Role');

    // Update the form
    $page
        ->fill('name', 'Senior Manager')
        ->fill('description', 'Senior manager role with more responsibilities')
        ->check('hidden');

    // Submit the form
    $page->submit()
        ->assertSee('Roles')
        ->assertPathIs('/roles')
        ->assertNoJavascriptErrors();

    // Verify the role was updated
    $role->refresh();
    expect($role->name)->toBe('Senior Manager');
    expect($role->description)->toBe('Senior manager role with more responsibilities');
    expect($role->hidden)->toBeTrue();
});

it('prevents updating a closed role', function (): void {
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
        ->create('Old Manager', 'Old manager role', false)
        ->close('No longer needed')
        ->persist();

    $role = Role::findOrFail($roleId);

    $page = $this->as($user, $territory)->visit("/roles/{$roleId}/update");

    $page->assertTitle("Update Role: {$role->name} - Laravel")
        ->assertSee('Update Role')
        ->assertSee('Cannot Update Role')
        ->assertSee('This role is closed and cannot be updated')
        ->assertNoJavascriptErrors();

    // The form fields and submit button should be disabled
    $page->assertDisabled('input[name="name"]');
    $page->assertDisabled('textarea[name="description"]');
    $page->assertDisabled('input[name="hidden"]');
    $page->assertDisabled('button[type="submit"]');
});

it('shows validation errors when updating with invalid data', function (): void {
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
        ->create('Manager', 'Manager role', false)
        ->persist();

    $page = $this->as($user, $territory)->visit("/roles/{$roleId}/update");

    $page->assertTitle('Update Role: Manager - Laravel')
        ->assertNoJavascriptErrors();

    // Try to submit with empty required fields
    $page->fill('name', '')
        ->fill('description', '')
        ->submit()
        ->assertSee('The name field is required')
        ->assertSee('The description field is required');
});

it('can cancel role update', function (): void {
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
        ->create('Manager', 'Manager role', false)
        ->persist();

    $role = Role::findOrFail($roleId);
    $originalName = $role->name;

    $page = $this->as($user, $territory)->visit("/roles/{$roleId}/update");

    $page->assertTitle("Update Role: {$role->name} - Laravel")
        ->fill('name', 'Changed Name');

    // Click cancel button
    $page->press('Cancel')
        ->assertPathIs('/roles')
        ->assertSee('Roles')
        ->assertNoJavascriptErrors();

    // Verify the role was NOT updated
    $role->refresh();
    expect($role->name)->toBe($originalName);
});
