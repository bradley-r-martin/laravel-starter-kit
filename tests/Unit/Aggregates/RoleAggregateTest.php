<?php

declare(strict_types=1);

use App\Aggregates\RoleAggregate;
use App\Events\Policy\PolicyAttached;
use App\Events\Policy\PolicyDetached;
use App\Events\Role\RoleClosed;
use App\Events\Role\RoleCreated;
use App\Events\Role\RoleUpdated;
use Spatie\EventSourcing\AggregateRoots\AggregateRoot;

it('can create a role', function () {
    $aggregate = RoleAggregate::retrieve('role-1');

    $aggregate->create(
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

    $aggregate->create(
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

    $aggregate->create(
        name: 'Admin',
        description: 'Administrator role'
    );

    $aggregate->persist();

    $aggregate = RoleAggregate::retrieve('role-1');
    $aggregate->close('Role no longer needed');

    expect($aggregate->getRecordedEvents())->toHaveCount(1);

    $event = $aggregate->getRecordedEvents()[0];
    expect($event)->toBeInstanceOf(RoleClosed::class);
    expect($event->reason)->toBe('Role no longer needed');
});

it('applies events correctly', function () {
    $aggregate = RoleAggregate::retrieve('role-1');

    $aggregate->create(
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
    $aggregate->close('Role deprecated');

    $events = $aggregate->getRecordedEvents();
    expect($events)->toHaveCount(3);

    $closedEvent = $events[2];
    expect($closedEvent)->toBeInstanceOf(RoleClosed::class);
    expect($closedEvent->reason)->toBe('Role deprecated');
});

it('can attach policies to a role', function () {
    $aggregate = RoleAggregate::retrieve('role-1');

    $aggregate->attachPolicy('App\\Policies\\UserPolicy', 'view');

    $events = $aggregate->getRecordedEvents();

    expect($events)->toHaveCount(1);
    expect($events[0])->toBeInstanceOf(PolicyAttached::class)
        ->policy->toBe('App\\Policies\\UserPolicy')
        ->ability->toBe('view');
});

it('can detach policies from a role', function () {
    $aggregate = RoleAggregate::retrieve('role-1');

    // Simulate that the policy is already attached
    $aggregate->attachedPolicies = [['App\\Policies\\UserPolicy', 'view']];

    $aggregate->detachPolicy('App\\Policies\\UserPolicy', 'view');

    $events = $aggregate->getRecordedEvents();

    expect($events)->toHaveCount(1);
    expect($events[0])->toBeInstanceOf(PolicyDetached::class)
        ->policy->toBe('App\\Policies\\UserPolicy')
        ->ability->toBe('view');
});

it('prevents duplicate policy attachments', function () {
    $aggregate = RoleAggregate::retrieve('role-1');

    // First attachment
    $aggregate->attachPolicy('App\\Policies\\UserPolicy', 'view');

    // Reset events to simulate persisted state
    $aggregate = RoleAggregate::retrieve('role-1');

    // Simulate that the policy is already attached by setting the state
    $aggregate->attachedPolicies = [['App\\Policies\\UserPolicy', 'view']];

    // Try to attach the same policy again
    $aggregate->attachPolicy('App\\Policies\\UserPolicy', 'view');

    $events = $aggregate->getRecordedEvents();

    expect($events)->toHaveCount(0); // No new event should be recorded
});

it('prevents detaching non-attached policies', function () {
    $aggregate = RoleAggregate::retrieve('role-1');

    // Try to detach a policy that was never attached
    $aggregate->detachPolicy('App\\Policies\\UserPolicy', 'view');

    $events = $aggregate->getRecordedEvents();

    expect($events)->toHaveCount(0); // No new event should be recorded
});

it('can attach multiple different policies', function () {
    $aggregate = RoleAggregate::retrieve('role-1');

    $aggregate->attachPolicy('App\\Policies\\UserPolicy', 'view');
    $aggregate->attachPolicy('App\\Policies\\OrderPolicy', 'create');
    $aggregate->attachPolicy('App\\Policies\\ReportPolicy', 'view');

    $events = $aggregate->getRecordedEvents();

    expect($events)->toHaveCount(3);
    expect($events[0])->toBeInstanceOf(PolicyAttached::class)
        ->policy->toBe('App\\Policies\\UserPolicy')
        ->ability->toBe('view');
    expect($events[1])->toBeInstanceOf(PolicyAttached::class)
        ->policy->toBe('App\\Policies\\OrderPolicy')
        ->ability->toBe('create');
    expect($events[2])->toBeInstanceOf(PolicyAttached::class)
        ->policy->toBe('App\\Policies\\ReportPolicy')
        ->ability->toBe('view');
});

it('can detach multiple policies', function () {
    $aggregate = RoleAggregate::retrieve('role-1');

    // Simulate existing attached policies
    $aggregate->attachedPolicies = [
        ['App\\Policies\\UserPolicy', 'view'],
        ['App\\Policies\\OrderPolicy', 'create'],
        ['App\\Policies\\ReportPolicy', 'view'],
    ];

    $aggregate->detachPolicy('App\\Policies\\UserPolicy', 'view');
    $aggregate->detachPolicy('App\\Policies\\ReportPolicy', 'view');

    $events = $aggregate->getRecordedEvents();

    expect($events)->toHaveCount(2);
    expect($events[0])->toBeInstanceOf(PolicyDetached::class)
        ->policy->toBe('App\\Policies\\UserPolicy')
        ->ability->toBe('view');
    expect($events[1])->toBeInstanceOf(PolicyDetached::class)
        ->policy->toBe('App\\Policies\\ReportPolicy')
        ->ability->toBe('view');
});

it('can attach and detach same policy in sequence', function () {
    $aggregate = RoleAggregate::retrieve('role-1');

    $aggregate->attachPolicy('App\\Policies\\UserPolicy', 'view');

    // Reset to simulate persisted state
    $aggregate = RoleAggregate::retrieve('role-1');
    $aggregate->attachedPolicies = [['App\\Policies\\UserPolicy', 'view']];

    $aggregate->detachPolicy('App\\Policies\\UserPolicy', 'view');

    $events = $aggregate->getRecordedEvents();

    expect($events)->toHaveCount(1);
    expect($events[0])->toBeInstanceOf(PolicyDetached::class)
        ->policy->toBe('App\\Policies\\UserPolicy')
        ->ability->toBe('view');
});

it('handles mixed attach and detach operations', function () {
    $aggregate = RoleAggregate::retrieve('role-1');

    // Simulate some existing policies
    $aggregate->attachedPolicies = [['App\\Policies\\ExistingPolicy', 'view']];

    $aggregate->attachPolicy('App\\Policies\\NewPolicy', 'create');
    $aggregate->detachPolicy('App\\Policies\\ExistingPolicy', 'view');
    $aggregate->attachPolicy('App\\Policies\\AnotherPolicy', 'update');

    $events = $aggregate->getRecordedEvents();

    expect($events)->toHaveCount(3);
    expect($events[0])->toBeInstanceOf(PolicyAttached::class)
        ->policy->toBe('App\\Policies\\NewPolicy')
        ->ability->toBe('create');
    expect($events[1])->toBeInstanceOf(PolicyDetached::class)
        ->policy->toBe('App\\Policies\\ExistingPolicy')
        ->ability->toBe('view');
    expect($events[2])->toBeInstanceOf(PolicyAttached::class)
        ->policy->toBe('App\\Policies\\AnotherPolicy')
        ->ability->toBe('update');
});

it('can record multiple policy operations', function () {
    $aggregate = RoleAggregate::retrieve('role-1');

    $aggregate->attachPolicy('App\\Policies\\UserPolicy', 'view');
    $aggregate->attachPolicy('App\\Policies\\OrderPolicy', 'create');

    // Reset to simulate persisted state for detachment
    $aggregate = RoleAggregate::retrieve('role-1');
    $aggregate->attachedPolicies = [
        ['App\\Policies\\UserPolicy', 'view'],
        ['App\\Policies\\OrderPolicy', 'create'],
    ];

    $aggregate->detachPolicy('App\\Policies\\UserPolicy', 'view');
    $aggregate->attachPolicy('App\\Policies\\ReportPolicy', 'view');

    $events = $aggregate->getRecordedEvents();

    expect($events)->toHaveCount(2);
    expect($events[0])->toBeInstanceOf(PolicyDetached::class)
        ->policy->toBe('App\\Policies\\UserPolicy')
        ->ability->toBe('view');
    expect($events[1])->toBeInstanceOf(PolicyAttached::class)
        ->policy->toBe('App\\Policies\\ReportPolicy')
        ->ability->toBe('view');
});
