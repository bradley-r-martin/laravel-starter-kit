<?php

declare(strict_types=1);

use App\Aggregates\RoleAggregate;
use App\Events\Role\RoleClosed;
use App\Events\Role\RoleCreated;
use App\Events\Role\RoleUpdated;
use Spatie\EventSourcing\AggregateRoots\AggregateRoot;

it('can create a role', function () {
    $aggregate = RoleAggregate::retrieve('role-1');

    $aggregate->createRole(
        name: 'Admin',
        description: 'Administrator role',
        hidden: false
    );

    expect($aggregate)->toBeInstanceOf(AggregateRoot::class);
    expect($aggregate->getRecordedEvents())->toHaveCount(1);

    $event = $aggregate->getRecordedEvents()[0];
    expect($event)->toBeInstanceOf(RoleCreated::class);
    expect($event->name)->toBe('Admin');
    expect($event->description)->toBe('Administrator role');
    expect($event->hidden)->toBeFalse();
});

it('can update a role', function () {
    $aggregate = RoleAggregate::retrieve('role-1');

    $aggregate->createRole(
        name: 'Admin',
        description: 'Administrator role',
        hidden: false
    );

    $aggregate->persist();

    $aggregate = RoleAggregate::retrieve('role-1');
    $aggregate->updateRole(
        name: 'Super Admin',
        description: 'Super Administrator role',
        hidden: true
    );

    expect($aggregate->getRecordedEvents())->toHaveCount(1);

    $event = $aggregate->getRecordedEvents()[0];
    expect($event)->toBeInstanceOf(RoleUpdated::class);
    expect($event->name)->toBe('Super Admin');
    expect($event->description)->toBe('Super Administrator role');
    expect($event->hidden)->toBeTrue();
});

it('can close a role', function () {
    $aggregate = RoleAggregate::retrieve('role-1');

    $aggregate->createRole(
        name: 'Admin',
        description: 'Administrator role'
    );

    $aggregate->persist();

    $aggregate = RoleAggregate::retrieve('role-1');
    $aggregate->closeRole('Role no longer needed');

    expect($aggregate->getRecordedEvents())->toHaveCount(1);

    $event = $aggregate->getRecordedEvents()[0];
    expect($event)->toBeInstanceOf(RoleClosed::class);
    expect($event->reason)->toBe('Role no longer needed');
});

it('applies events correctly', function () {
    $aggregate = RoleAggregate::retrieve('role-1');

    $aggregate->createRole(
        name: 'Admin',
        description: 'Administrator role',
        hidden: false
    );

    // Check that events are recorded
    $events = $aggregate->getRecordedEvents();
    expect($events)->toHaveCount(1);

    $createdEvent = $events[0];
    expect($createdEvent)->toBeInstanceOf(RoleCreated::class);
    expect($createdEvent->name)->toBe('Admin');
    expect($createdEvent->description)->toBe('Administrator role');
    expect($createdEvent->hidden)->toBeFalse();

    // Test update
    $aggregate->updateRole(
        name: 'Super Admin',
        hidden: true
    );

    $events = $aggregate->getRecordedEvents();
    expect($events)->toHaveCount(2);

    $updatedEvent = $events[1];
    expect($updatedEvent)->toBeInstanceOf(RoleUpdated::class);
    expect($updatedEvent->name)->toBe('Super Admin');
    expect($updatedEvent->hidden)->toBeTrue();

    // Test close
    $aggregate->closeRole('Role deprecated');

    $events = $aggregate->getRecordedEvents();
    expect($events)->toHaveCount(3);

    $closedEvent = $events[2];
    expect($closedEvent)->toBeInstanceOf(RoleClosed::class);
    expect($closedEvent->reason)->toBe('Role deprecated');
});
