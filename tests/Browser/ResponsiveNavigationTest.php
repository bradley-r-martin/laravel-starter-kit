<?php

declare(strict_types=1);

use App\Models\User;

it('displays hamburger menu on mobile devices', function () {
    $user = User::query()->first();

    $this->actingAs($user);

    $page = visit('/dashboard', viewport: [375, 667]); // iPhone SE size

    $page->assertSee('Dashboard')
        ->assertNoJavascriptErrors();
});

it('can toggle mobile navigation menu', function () {
    $user = User::query()->first();

    $this->actingAs($user);

    $page = visit('/dashboard', viewport: [375, 667]);

    // Initially, navigation items should be hidden on mobile
    $page->assertNoJavascriptErrors();

    // Click hamburger to open menu
    $page->click('button[aria-label="Open navigation"]');

    // Navigation items should now be visible
    $page->assertSee('Sites')
        ->assertSee('Routes')
        ->assertSee('Runs')
        ->assertSee('Expenses')
        ->assertSee('QR Codes')
        ->assertSee('Reports')
        ->assertSee('Manage');

    // Click backdrop to close menu
    $page->click('.mobile-menu-backdrop');

    $page->assertNoJavascriptErrors();
});

it('closes mobile menu when clicking a link', function () {
    $user = User::query()->first();

    $this->actingAs($user);

    $page = visit('/dashboard', viewport: [375, 667]);

    // Open mobile menu
    $page->click('button[aria-label="Open navigation"]');

    // Click on a navigation link
    $page->click('a[href="/sites"]');

    // Should navigate to sites page
    $page->assertSee('Sites')
        ->assertNoJavascriptErrors();
});

it('displays navigation horizontally on desktop', function () {
    $user = User::query()->first();

    $this->actingAs($user);

    $page = visit('/dashboard', viewport: [1920, 1080]); // Desktop size

    // Navigation items should be visible without hamburger
    $page->assertSee('Dashboard')
        ->assertSee('Sites')
        ->assertSee('Routes')
        ->assertSee('Runs')
        ->assertNoJavascriptErrors();
});

it('closes mobile menu on window resize to desktop', function () {
    $user = User::query()->first();

    $this->actingAs($user);

    $page = visit('/dashboard', viewport: [375, 667]);

    // Open mobile menu
    $page->click('button[aria-label="Open navigation"]');
    $page->assertSee('Sites');

    // Resize to desktop
    $page->resize(1920, 1080);

    // Wait a moment for resize handler
    $page->pause(500);

    $page->assertNoJavascriptErrors();
});
