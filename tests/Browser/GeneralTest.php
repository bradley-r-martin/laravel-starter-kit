<?php

declare(strict_types=1);

describe('General Pages', function (): void {

    it('redirects unauthenticated users to login for protected routes', function (): void {
        $protectedRoutes = [
            '/dashboard',
            '/users',
            '/users/create',
            '/roles',
            '/roles/create',
            '/territory',
        ];

        foreach ($protectedRoutes as $route) {
            visit($route)->assertPathIs('/login');
        }
    });

    it('shows proper page titles for all routes', function (): void {
        // Test login page
        visit('/login')
            ->assertTitle('Login - Laravel')
            ->assertNoJavascriptErrors();

        // Test recovery page
        visit('/recovery')
            ->assertTitle('Account Recovery - Laravel')
            ->assertNoJavascriptErrors();
    });

    it('handles 404 pages gracefully', function (): void {
        visit('/non-existent-page')
            ->assertSee('404')
            ->assertNoJavascriptErrors();
    });
});
