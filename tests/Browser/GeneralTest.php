<?php

declare(strict_types=1);

describe('General Pages', function (): void {
    it('has welcome page', function (): void {
        $page = visit('/');

        $page->assertTitle('Welcome - Laravel')
            ->assertNoJavascriptErrors()
            ->assertSee('Laravel')
            ->assertSee('Get started by editing resources/js/pages/welcome.tsx');
    });

    it('blocks access to protected pages for unauthenticated users', function (): void {
        $page = visit('/roles/create');
        $page->assertPathIs('/login');
    });
});
