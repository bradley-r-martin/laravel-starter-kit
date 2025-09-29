<?php

declare(strict_types=1);

use App\Aggregates\PolicyAggregate;
use App\Events\Policy\PolicyCreated;
use App\Events\Policy\PolicyDestroyed;
use App\Events\Policy\PolicyUpdated;

test('policy aggregate records create event', function (): void {
    $aggregate = PolicyAggregate::retrieve('policy::manage-users');

    $aggregate->createPolicy(
        namespace: 'policy::manage-users',
        policy: 'App\\Policies\\UserPolicy',
        ability: 'manage',
        description: 'Manage users',
        hidden: false,
    );

    $events = $aggregate->getRecordedEvents();

    expect($events)->toHaveCount(1);
    expect($events[0])->toBeInstanceOf(PolicyCreated::class)
        ->namespace->toBe('policy::manage-users')
        ->policy->toBe('App\\Policies\\UserPolicy')
        ->ability->toBe('manage')
        ->description->toBe('Manage users')
        ->hidden->toBeFalse();
});

test('policy aggregate records update event', function (): void {
    $aggregate = PolicyAggregate::retrieve('policy::manage-users');

    $aggregate->updatePolicy(
        policy: 'App\\Policies\\AdminPolicy',
        description: 'Manage administrators',
        hidden: true,
    );

    $events = $aggregate->getRecordedEvents();

    expect($events)->toHaveCount(1);
    expect($events[0])->toBeInstanceOf(PolicyUpdated::class)
        ->namespace->toBe('')
        ->policy->toBe('App\\Policies\\AdminPolicy')
        ->description->toBe('Manage administrators')
        ->hidden->toBeTrue();
});

test('policy aggregate records destroy event', function (): void {
    $aggregate = PolicyAggregate::retrieve('policy::manage-users');

    $aggregate->destroyPolicy();

    $events = $aggregate->getRecordedEvents();

    expect($events)->toHaveCount(1);
    expect($events[0])->toBeInstanceOf(PolicyDestroyed::class)
        ->namespace->toBe('');
});

test('policy aggregate creates event with correct data', function (): void {
    $aggregate = PolicyAggregate::retrieve('policy::manage-users');

    $aggregate->createPolicy(
        namespace: 'policy::manage-users',
        policy: 'App\\Policies\\UserPolicy',
        ability: 'manage',
        description: 'Manage users',
        hidden: false,
    );

    $events = $aggregate->getRecordedEvents();
    $event = $events[0];

    expect($event)->toBeInstanceOf(PolicyCreated::class);
    expect($event->namespace)->toBe('policy::manage-users');
    expect($event->policy)->toBe('App\\Policies\\UserPolicy');
    expect($event->ability)->toBe('manage');
    expect($event->description)->toBe('Manage users');
    expect($event->hidden)->toBeFalse();
});

test('policy aggregate creates update event with correct data', function (): void {
    $aggregate = PolicyAggregate::retrieve('policy::manage-users');

    $aggregate->updatePolicy(
        policy: 'App\\Policies\\AdminPolicy',
        description: 'Manage administrators',
        hidden: true,
    );

    $events = $aggregate->getRecordedEvents();
    $event = $events[0];

    expect($event)->toBeInstanceOf(PolicyUpdated::class);
    expect($event->namespace)->toBe('');
    expect($event->policy)->toBe('App\\Policies\\AdminPolicy');
    expect($event->description)->toBe('Manage administrators');
    expect($event->hidden)->toBeTrue();
});

test('policy aggregate creates destroy event with correct data', function (): void {
    $aggregate = PolicyAggregate::retrieve('policy::manage-users');

    $aggregate->destroyPolicy();

    $events = $aggregate->getRecordedEvents();
    $event = $events[0];

    expect($event)->toBeInstanceOf(PolicyDestroyed::class);
    expect($event->namespace)->toBe('');
});

test('policy aggregate handles partial updates correctly', function (): void {
    $aggregate = PolicyAggregate::retrieve('policy::manage-users');

    $aggregate->updatePolicy(
        description: 'Updated description',
        // policy, ability, and hidden remain null
    );

    $events = $aggregate->getRecordedEvents();
    $event = $events[0];

    expect($event)->toBeInstanceOf(PolicyUpdated::class);
    expect($event->namespace)->toBe('');
    expect($event->policy)->toBeNull();
    expect($event->ability)->toBeNull();
    expect($event->description)->toBe('Updated description');
    expect($event->hidden)->toBeNull();
});

test('policy aggregate handles empty update gracefully', function (): void {
    $aggregate = PolicyAggregate::retrieve('policy::manage-users');

    $aggregate->updatePolicy(); // No parameters

    $events = $aggregate->getRecordedEvents();
    $event = $events[0];

    expect($event)->toBeInstanceOf(PolicyUpdated::class);
    expect($event->namespace)->toBe('');
    expect($event->policy)->toBeNull();
    expect($event->ability)->toBeNull();
    expect($event->description)->toBeNull();
    expect($event->hidden)->toBeNull();
});

test('policy aggregate can record multiple events', function (): void {
    $aggregate = PolicyAggregate::retrieve('policy::manage-users');

    $aggregate->createPolicy(
        namespace: 'policy::manage-users',
        policy: 'App\\Policies\\UserPolicy',
        ability: 'manage',
        description: 'Manage users',
        hidden: false,
    );

    $aggregate->updatePolicy(
        description: 'Updated description',
    );

    $aggregate->destroyPolicy();

    $events = $aggregate->getRecordedEvents();

    expect($events)->toHaveCount(3);
    expect($events[0])->toBeInstanceOf(PolicyCreated::class);
    expect($events[1])->toBeInstanceOf(PolicyUpdated::class);
    expect($events[2])->toBeInstanceOf(PolicyDestroyed::class);
});
