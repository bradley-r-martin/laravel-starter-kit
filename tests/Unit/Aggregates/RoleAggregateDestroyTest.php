<?php

declare(strict_types=1);

use App\Aggregates\RoleAggregate;
use App\Events\Role\RoleDestroyed;

it('can destroy a role', function () {
    $aggregate = RoleAggregate::retrieve('role-1');

    $aggregate->create(
        name: 'Admin',
        description: 'Administrator role'
    );

    $aggregate->persist();

    $aggregate = RoleAggregate::retrieve('role-1');
    $aggregate->destroy();

    expect($aggregate->getRecordedEvents())->toHaveCount(1);

    $event = $aggregate->getRecordedEvents()[0];
    expect($event)->toBeInstanceOf(RoleDestroyed::class);
});
