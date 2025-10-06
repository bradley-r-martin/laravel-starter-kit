<?php

declare(strict_types=1);

use App\Models\Territory;

describe('Territory Selection', function (): void {
    it('displays the territory selection page correctly', function (): void {
        $operator = createOperator();
        createTerritory($operator, 'North Territory');
        createTerritory($operator, 'South Territory');
        $user = createUser($operator);

        $this->actingAs($user);

        visit('/territory')
            ->assertTitle('Select Territory - Laravel')
            ->assertSee('Select Territory')
            ->assertSee('Choose which territory you want to access')
            ->assertSee('North Territory')
            ->assertSee('South Territory')
            ->assertSee('Logout')
            ->assertNoJavascriptErrors();
    });

    it('shows only territories belonging to the user\'s operator', function (): void {
        $operator1 = createOperator('Operator 1', 'operator1@example.com');
        $operator2 = createOperator('Operator 2', 'operator2@example.com');

        createTerritory($operator1, 'My Territory');
        createTerritory($operator2, 'Other Territory');

        $user = createUser($operator1);
        $this->actingAs($user);

        visit('/territory')
            ->assertTitle('Select Territory - Laravel')
            ->assertSee('My Territory')
            ->assertDontSee('Other Territory')
            ->assertNoJavascriptErrors();
    });

    it('filters out closed territories', function (): void {
        $operator = createOperator();
        createTerritory($operator, 'Open Territory');

        Territory::create([
            'operator_id' => $operator->id,
            'name' => 'Closed Territory',
            'closed_at' => now(),
        ]);

        $user = createUser($operator);
        $this->actingAs($user);

        visit('/territory')
            ->assertTitle('Select Territory - Laravel')
            ->assertSee('Open Territory')
            ->assertDontSee('Closed Territory')
            ->assertNoJavascriptErrors();
    });

    it('shows empty territory list when no territories exist', function (): void {
        $operator = createOperator();
        $user = createUser($operator);

        $this->actingAs($user);

        visit('/territory')
            ->assertTitle('Select Territory - Laravel')
            ->assertSee('Select Territory')
            ->assertSee('Choose which territory you want to access')
            ->assertSee('Logout')
            ->assertNoJavascriptErrors();
    });

    it('redirects to territory selection when accessing dashboard without territory', function (): void {
        $operator = createOperator();
        createTerritory($operator);
        $user = createUser($operator);

        $this->as($user)->visit('/dashboard')
            ->assertPathIs('/territory')
            ->assertSee('Select Territory')
            ->assertNoJavascriptErrors();
    });

    it('allows dashboard access when territory is selected', function (): void {
        ['territory' => $territory, 'user' => $user] = createTestEnvironment();

        $this->as($user, $territory)->visit('/dashboard')
            ->assertPathIs('/dashboard')
            ->assertSee('Dashboard')
            ->assertNoJavascriptErrors();
    });

    it('allows territory selection and navigation', function (): void {
        $operator = createOperator();
        $territory = createTerritory($operator, 'Test Territory');
        $user = createUser($operator);

        $this->actingAs($user);

        visit('/territory')
            ->assertTitle('Select Territory - Laravel')
            ->click('Test Territory')
            ->assertPathIs('/dashboard')
            ->assertSee('Dashboard')
            ->assertNoJavascriptErrors();
    });
});
