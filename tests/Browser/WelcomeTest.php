<?php

declare(strict_types=1);

it('has welcome page', function (): void {
    $page = visit('/');

    $page->assertTitle('Welcome - Laravel')
        ->assertNoJavascriptErrors()
        ->assertSee('Laravel')
        ->assertSee('Get started by editing resources/js/pages/welcome.tsx');
});
