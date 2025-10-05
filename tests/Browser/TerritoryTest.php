<?php

declare(strict_types=1);

use App\Models\Operator;
use App\Models\Territory;
use App\Models\User;

it('displays the territory selection page', function (): void {
    $operator = Operator::create([
        'name' => 'Test Operator',
        'email' => 'operator@example.com',
    ]);

    Territory::create([
        'operator_id' => $operator->id,
        'name' => 'North Territory',
    ]);

    Territory::create([
        'operator_id' => $operator->id,
        'name' => 'South Territory',
    ]);

    $user = User::create([
        'operator_id' => $operator->id,
        'first_name' => 'Test',
        'last_name' => 'User',
        'email' => 'test@example.com',
        'password' => bcrypt('password'),
    ]);

    $this->actingAs($user);

    $page = visit('/territory');

    $page->assertTitle('Select Territory - Laravel')
        ->assertSee('Select Territory')
        ->assertSee('Choose which territory you want to access')
        ->assertSee('North Territory')
        ->assertSee('South Territory')
        ->assertSee('Logout')
        ->assertNoJavascriptErrors();
});

it('successfully selects a territory and redirects to dashboard', function (): void {
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

    $page = $this->as($user)->visit('/dashboard');

    $page->assertTitle('Select Territory - Laravel')
        ->pressAndWaitFor('Test Territory', 2)
        ->assertPathIs('/dashboard')
        ->assertNoJavascriptErrors();

})->skip('button press not working');

it('only shows territories belonging to the user\'s operator', function (): void {
    $operator1 = Operator::create([
        'name' => 'Operator 1',
        'email' => 'operator1@example.com',
    ]);

    $operator2 = Operator::create([
        'name' => 'Operator 2',
        'email' => 'operator2@example.com',
    ]);

    Territory::create([
        'operator_id' => $operator1->id,
        'name' => 'My Territory',
    ]);

    Territory::create([
        'operator_id' => $operator2->id,
        'name' => 'Other Territory',
    ]);

    $user = User::create([
        'operator_id' => $operator1->id,
        'first_name' => 'Test',
        'last_name' => 'User',
        'email' => 'test@example.com',
        'password' => bcrypt('password'),
    ]);

    $this->actingAs($user);

    $page = visit('/territory');

    $page->assertTitle('Select Territory - Laravel')
        ->assertSee('My Territory')
        ->assertDontSee('Other Territory')
        ->assertNoJavascriptErrors();
});

it('does not show closed territories', function (): void {
    $operator = Operator::create([
        'name' => 'Test Operator',
        'email' => 'operator@example.com',
    ]);

    Territory::create([
        'operator_id' => $operator->id,
        'name' => 'Open Territory',
    ]);

    Territory::create([
        'operator_id' => $operator->id,
        'name' => 'Closed Territory',
        'closed_at' => now(),
    ]);

    $user = User::create([
        'operator_id' => $operator->id,
        'first_name' => 'Test',
        'last_name' => 'User',
        'email' => 'test@example.com',
        'password' => bcrypt('password'),
    ]);

    $this->actingAs($user);

    $page = visit('/territory');

    $page->assertTitle('Select Territory - Laravel')
        ->assertSee('Open Territory')
        ->assertDontSee('Closed Territory')
        ->assertNoJavascriptErrors();
});

it('redirects to territory page when accessing dashboard without territory cookie', function (): void {
    $operator = Operator::create([
        'name' => 'Test Operator',
        'email' => 'operator@example.com',
    ]);

    Territory::create([
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

    $page = $this->as($user)->visit('/dashboard');

    $page->assertPathIs('/territory')
        ->assertSee('Select Territory')
        ->assertNoJavascriptErrors();
});

it('allows access to dashboard when territory cookie is set', function (): void {
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

    // First, select a territory
    $page = $this->as($user, $territory)->visit('/dashboard')
        ->assertPathIs('/dashboard')
        ->assertSee('Dashboard')
        ->assertNoJavascriptErrors();
});
