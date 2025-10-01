<?php

declare(strict_types=1);

it('blocks access to the create page for unauthenticated users', function (): void {
    $page = visit('/roles/create');
    $page->assertPathIs('/login');
});
