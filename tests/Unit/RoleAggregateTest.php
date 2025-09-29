<?php

declare(strict_types=1);

use App\Aggregates\RoleAggregate;
use App\Events\Role\PolicyAttachedToRole;
use App\Events\Role\PolicyDetachedFromRole;
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

it('can attach policies to a role', function () {
    $aggregate = RoleAggregate::retrieve('role-1');

    $aggregate->attachPolicy('policy::manage-users');

    $events = $aggregate->getRecordedEvents();

    expect($events)->toHaveCount(1);
    expect($events[0])->toBeInstanceOf(PolicyAttachedToRole::class)
        ->policyNamespace->toBe('policy::manage-users');
});

it('can detach policies from a role', function () {
    $aggregate = RoleAggregate::retrieve('role-1');

    // Simulate that the policy is already attached
    $aggregate->policyNamespaces = ['policy::manage-users'];

    $aggregate->detachPolicy('policy::manage-users');

    $events = $aggregate->getRecordedEvents();

    expect($events)->toHaveCount(1);
    expect($events[0])->toBeInstanceOf(PolicyDetachedFromRole::class)
        ->policyNamespace->toBe('policy::manage-users');
});

it('prevents duplicate policy attachments', function () {
    $aggregate = RoleAggregate::retrieve('role-1');

    // First attachment
    $aggregate->attachPolicy('policy::manage-users');

    // Reset events to simulate persisted state
    $aggregate = RoleAggregate::retrieve('role-1');

    // Simulate that the policy is already attached by setting the state
    $aggregate->policyNamespaces = ['policy::manage-users'];

    // Try to attach the same policy again
    $aggregate->attachPolicy('policy::manage-users');

    $events = $aggregate->getRecordedEvents();

    expect($events)->toHaveCount(0); // No new event should be recorded
});

it('prevents detaching non-attached policies', function () {
    $aggregate = RoleAggregate::retrieve('role-1');

    // Try to detach a policy that was never attached
    $aggregate->detachPolicy('policy::manage-users');

    $events = $aggregate->getRecordedEvents();

    expect($events)->toHaveCount(0); // No new event should be recorded
});

it('can attach multiple different policies', function () {
    $aggregate = RoleAggregate::retrieve('role-1');

    $aggregate->attachPolicy('policy::manage-users');
    $aggregate->attachPolicy('policy::manage-orders');
    $aggregate->attachPolicy('policy::view-reports');

    $events = $aggregate->getRecordedEvents();

    expect($events)->toHaveCount(3);
    expect($events[0])->toBeInstanceOf(PolicyAttachedToRole::class)
        ->policyNamespace->toBe('policy::manage-users');
    expect($events[1])->toBeInstanceOf(PolicyAttachedToRole::class)
        ->policyNamespace->toBe('policy::manage-orders');
    expect($events[2])->toBeInstanceOf(PolicyAttachedToRole::class)
        ->policyNamespace->toBe('policy::view-reports');
});

it('can detach multiple policies', function () {
    $aggregate = RoleAggregate::retrieve('role-1');

    // Simulate existing attached policies
    $aggregate->policyNamespaces = [
        'policy::manage-users',
        'policy::manage-orders',
        'policy::view-reports',
    ];

    $aggregate->detachPolicy('policy::manage-users');
    $aggregate->detachPolicy('policy::view-reports');

    $events = $aggregate->getRecordedEvents();

    expect($events)->toHaveCount(2);
    expect($events[0])->toBeInstanceOf(PolicyDetachedFromRole::class)
        ->policyNamespace->toBe('policy::manage-users');
    expect($events[1])->toBeInstanceOf(PolicyDetachedFromRole::class)
        ->policyNamespace->toBe('policy::view-reports');
});

it('can attach and detach same policy in sequence', function () {
    $aggregate = RoleAggregate::retrieve('role-1');

    $aggregate->attachPolicy('policy::manage-users');

    // Reset to simulate persisted state
    $aggregate = RoleAggregate::retrieve('role-1');
    $aggregate->policyNamespaces = ['policy::manage-users'];

    $aggregate->detachPolicy('policy::manage-users');

    $events = $aggregate->getRecordedEvents();

    expect($events)->toHaveCount(1);
    expect($events[0])->toBeInstanceOf(PolicyDetachedFromRole::class)
        ->policyNamespace->toBe('policy::manage-users');
});

it('handles mixed attach and detach operations', function () {
    $aggregate = RoleAggregate::retrieve('role-1');

    // Simulate some existing policies
    $aggregate->policyNamespaces = ['policy::existing-policy'];

    $aggregate->attachPolicy('policy::new-policy');
    $aggregate->detachPolicy('policy::existing-policy');
    $aggregate->attachPolicy('policy::another-policy');

    $events = $aggregate->getRecordedEvents();

    expect($events)->toHaveCount(3);
    expect($events[0])->toBeInstanceOf(PolicyAttachedToRole::class)
        ->policyNamespace->toBe('policy::new-policy');
    expect($events[1])->toBeInstanceOf(PolicyDetachedFromRole::class)
        ->policyNamespace->toBe('policy::existing-policy');
    expect($events[2])->toBeInstanceOf(PolicyAttachedToRole::class)
        ->policyNamespace->toBe('policy::another-policy');
});

it('can record multiple policy operations', function () {
    $aggregate = RoleAggregate::retrieve('role-1');

    $aggregate->attachPolicy('policy::manage-users');
    $aggregate->attachPolicy('policy::manage-orders');

    // Reset to simulate persisted state for detachment
    $aggregate = RoleAggregate::retrieve('role-1');
    $aggregate->policyNamespaces = ['policy::manage-users', 'policy::manage-orders'];

    $aggregate->detachPolicy('policy::manage-users');
    $aggregate->attachPolicy('policy::view-reports');

    $events = $aggregate->getRecordedEvents();

    expect($events)->toHaveCount(2);
    expect($events[0])->toBeInstanceOf(PolicyDetachedFromRole::class)
        ->policyNamespace->toBe('policy::manage-users');
    expect($events[1])->toBeInstanceOf(PolicyAttachedToRole::class)
        ->policyNamespace->toBe('policy::view-reports');
});
