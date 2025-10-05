<?php

declare(strict_types=1);

use App\Models\User;

it('can view the users list through the browser', function (): void {
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

    // Delete the test user after authenticating
    $userId = $user->id;

    $page = $this->as($user, $territory)->visit('/users');

    // Now delete the user from database
    User::query()->where('id', $userId)->delete();

    // Visit again to see empty state
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
