<?php

declare(strict_types=1);

arch()->preset()->php();
arch()->preset()->security();

// Models can have protected methods (like casts())
arch('models')
    ->expect('App\Models')
    ->toOnlyUse([
        'Illuminate',
        'App',
        'Spatie',
        'Carbon',
        'NotificationChannels\WebPush',
    ]);

arch('controllers')
    ->expect('App\Http\Controllers')
    ->not->toBeUsed();

//
