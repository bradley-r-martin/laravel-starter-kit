<?php

declare(strict_types=1);

use App\Models\User;

describe('User Management', function (): void {
    describe('User List', function (): void {
        it('can view the users list', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $page = $this->as($user, $territory)->visit('/users');

            $page->assertTitle('Users - Laravel')
                ->assertSee('Users')
                ->assertSee($user->first_name)
                ->assertSee($user->last_name)
                ->assertSee($user->email)
                ->assertNoJavascriptErrors();
        });

        it('shows no users message when no users exist', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $userId = $user->id;

            $page = $this->as($user, $territory)->visit('/users');

            User::query()->where('id', $userId)->delete();

            $page = $this->as($user, $territory)->visit('/users');

            $page->assertSee('Users')
                ->assertSee('No users found')
                ->assertNoJavascriptErrors();
        });

        it('displays user status badges correctly', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $page = $this->as($user, $territory)->visit('/users');

            $page->assertSee('Active')
                ->assertNoJavascriptErrors();
        });
    });

    describe('User Creation', function (): void {
        it('can create a user', function (): void {
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
            expect($newUser->password)->not->toBe('SecurePassword123!');
            expect($newUser->password)->toStartWith('$2y$');
        })->skip();

        it('shows validation errors', function (): void {
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
                ->fill('email', $user->email)
                ->fill('password', 'SecurePassword123!')
                ->submit()
                ->assertSee('The email has already been taken');
        })->skip();

        it('can cancel creation', function (): void {
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
    });

    describe('User Update', function (): void {
        it('can update a user', function (): void {
            ['territory' => $territory, 'user' => $user, 'operator' => $operator, 'role' => $role] = createTestEnvironment();

            $page = $this->as($user, $territory)->visit("/users/{$user->id}/update");

            $page->assertTitle('Update User - Laravel')
                ->assertSee('Update User')
                ->assertSee('Operator')
                ->assertSee('Role')
                ->assertSee('First Name')
                ->assertSee('Last Name')
                ->assertSee('Email')
                ->assertNoJavascriptErrors();

            $page->fill('first_name', 'Jane')
                ->fill('last_name', 'Smith')
                ->select('operator_id', $operator->id)
                ->select('role_id', $role->id)
                ->fill('email', 'jane.smith@example.com')
                ->submit()
                ->assertSee('Users')
                ->assertPathIs('/users')
                ->assertNoJavascriptErrors();

            $updatedUser = User::find($user->id);

            expect($updatedUser)->not->toBeNull();
            expect($updatedUser->first_name)->toBe('Jane');
            expect($updatedUser->last_name)->toBe('Smith');
            expect($updatedUser->email)->toBe('jane.smith@example.com');
        })->skip();

        it('shows validation errors on update', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $page = $this->as($user, $territory)->visit("/users/{$user->id}/update");

            $page->assertTitle('Update User - Laravel')
                ->assertNoJavascriptErrors()
                ->fill('first_name', '')
                ->fill('last_name', '')
                ->fill('email', '')
                ->submit()
                ->assertSee('The operator id field is required')
                ->assertSee('The first name field is required')
                ->assertSee('The last name field is required')
                ->assertSee('The email field is required');
        })->skip();

        it('validates email uniqueness on update excluding current user', function (): void {
            ['territory' => $territory, 'user' => $user, 'operator' => $operator, 'role' => $role] = createTestEnvironment();

            // Create another user to test uniqueness
            $anotherUser = User::create([
                'id' => (string) Illuminate\Support\Str::ulid(),
                'operator_id' => $operator->id,
                'role_id' => $role->id,
                'first_name' => 'Another',
                'last_name' => 'User',
                'email' => 'another@example.com',
                'password' => Illuminate\Support\Facades\Hash::make('password'),
                '__operator_name' => $operator->name,
            ]);

            $page = $this->as($user, $territory)->visit("/users/{$user->id}/update");

            $page->fill('email', 'another@example.com')
                ->submit()
                ->assertSee('The email has already been taken');
        })->skip();

        it('can cancel update', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $originalEmail = $user->email;

            $this->as($user, $territory)->visit("/users/{$user->id}/update")
                ->fill('first_name', 'Changed')
                ->fill('last_name', 'Name')
                ->fill('email', 'changed@example.com')
                ->press('Cancel')
                ->assertPathIs('/users')
                ->assertSee('Users')
                ->assertNoJavascriptErrors();

            $unchangedUser = User::find($user->id);
            expect($unchangedUser->email)->toBe($originalEmail);
            expect($unchangedUser->first_name)->not->toBe('Changed');
        })->skip();
    });
});
