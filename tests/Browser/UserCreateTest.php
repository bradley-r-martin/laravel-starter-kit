<?php

declare(strict_types=1);

use App\Models\User;

it('can create a user through the browser', function (): void {
    ['territory' => $territory, 'user' => $user, 'operator' => $operator, 'role' => $role] = createTestEnvironment();

    $page = $this->as($user, $territory)->visit('/users/create');

    $page->assertTitle('Create User - Laravel')
        ->assertSee('Create User')
        ->assertSee('Operator')
        ->assertSee('Role')
        ->assertSee('First Name')
        ->assertSee('Last Name')
        ->assertSee('Email')
        ->assertSee('Password')
        ->assertNoJavascriptErrors();

    $page->fill('first_name', 'John')
        ->fill('last_name', 'Doe')
        ->select('operator_id', $operator->id)
        ->select('role_id', $role->id)
        ->fill('email', 'john.doe@example.com')
        ->fill('password', 'SecurePassword123!')
        ->submit()
        ->assertSee('Users')
        ->assertPathIs('/users')
        ->assertNoJavascriptErrors();

    $newUser = User::where('email', 'john.doe@example.com')->first();

    expect($newUser)->not->toBeNull();
    expect($newUser->first_name)->toBe('John');
    expect($newUser->last_name)->toBe('Doe');
    expect($newUser->email)->toBe('john.doe@example.com');

    // Verify password is hashed, not stored in plain text
    expect($newUser->password)->not->toBe('SecurePassword123!');
    expect($newUser->password)->toStartWith('$2y$'); // BCrypt hash prefix
})->skip();

it('shows validation errors for user creation', function (): void {
    ['territory' => $territory, 'user' => $user] = createTestEnvironment();

    $page = $this->as($user, $territory)->visit('/users/create');

    $page->assertTitle('Create User - Laravel')
        ->assertNoJavascriptErrors()
        ->submit()
        ->assertSee('The operator id field is required')
        ->assertSee('The first name field is required')
        ->assertSee('The last name field is required')
        ->assertSee('The email field is required')
        ->assertSee('The password field is required');
})->skip();

it('validates email uniqueness', function (): void {
    ['territory' => $territory, 'user' => $user] = createTestEnvironment();

    $page = $this->as($user, $territory)->visit('/users/create');

    $page->fill('first_name', 'Test')
        ->fill('last_name', 'User')
        ->fill('email', $user->email) // Use existing user's email
        ->fill('password', 'SecurePassword123!')
        ->submit()
        ->assertSee('The email has already been taken');
})->skip();

it('can cancel user creation', function (): void {
    ['territory' => $territory, 'user' => $user] = createTestEnvironment();

    $this->as($user, $territory)->visit('/users/create')
        ->fill('first_name', 'Test')
        ->fill('last_name', 'User')
        ->fill('email', 'cancel@example.com')
        ->fill('password', 'SecurePassword123!')
        ->press('Cancel')
        ->assertPathIs('/users')
        ->assertSee('Users')
        ->assertNoJavascriptErrors();

    expect(User::where('email', 'cancel@example.com')->first())->toBeNull();
})->skip();
