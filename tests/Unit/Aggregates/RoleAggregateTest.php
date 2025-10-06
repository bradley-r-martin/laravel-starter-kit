<?php

declare(strict_types=1);

use App\Aggregates\RoleAggregate;
use App\Events\Policy\PolicyAttached;
use App\Events\Policy\PolicyDeprecated;
use App\Events\Policy\PolicyDetached;
use App\Events\Role\RoleClosed;
use App\Events\Role\RoleCreated;
use App\Events\Role\RoleDestroyed;
use App\Events\Role\RoleReopened;
use App\Events\Role\RoleUpdated;

describe('Role Creation', function () {
    it('records role created event', function () {
        $aggregate = RoleAggregate::retrieve('role-1');

        $aggregate->create(
            name: 'Admin',
            description: 'Administrator role',
            hidden: false
        );

        expect($aggregate->getRecordedEvents())->toHaveCount(1);

        $event = $aggregate->getRecordedEvents()[0];
        expect($event)->toBeInstanceOf(RoleCreated::class)
            ->name->toBe('Admin')
            ->description->toBe('Administrator role')
            ->hidden->toBeFalse();
    });
});

describe('Role Updates', function () {
    it('records role updated event', function () {
        $aggregate = RoleAggregate::retrieve('role-1')
            ->create(name: 'Admin', description: 'Administrator role')
            ->persist();

        $aggregate = RoleAggregate::retrieve('role-1')
            ->update(name: 'Super Admin', description: 'Super Administrator role', hidden: true);

        expect($aggregate->getRecordedEvents())->toHaveCount(1);

        $event = $aggregate->getRecordedEvents()[0];
        expect($event)->toBeInstanceOf(RoleUpdated::class)
            ->name->toBe('Super Admin')
            ->description->toBe('Super Administrator role')
            ->hidden->toBeTrue();
    });

    it('records role closed event', function () {
        $aggregate = RoleAggregate::retrieve('role-2')
            ->create(name: 'Admin', description: 'Administrator role')
            ->persist();

        $aggregate = RoleAggregate::retrieve('role-2')
            ->close('Role no longer needed');

        expect($aggregate->getRecordedEvents())->toHaveCount(1);

        $event = $aggregate->getRecordedEvents()[0];
        expect($event)->toBeInstanceOf(RoleClosed::class)
            ->reason->toBe('Role no longer needed');
    });

    it('records role reopened event', function () {
        $aggregate = RoleAggregate::retrieve('role-3')
            ->create(name: 'Admin', description: 'Administrator role')
            ->persist();

        $aggregate = RoleAggregate::retrieve('role-3')
            ->reopen('Role is needed again');

        expect($aggregate->getRecordedEvents())->toHaveCount(1);

        $event = $aggregate->getRecordedEvents()[0];
        expect($event)->toBeInstanceOf(RoleReopened::class)
            ->reason->toBe('Role is needed again');
    });

    it('records role destroyed event', function () {
        $aggregate = RoleAggregate::retrieve('role-4')
            ->create(name: 'Admin', description: 'Administrator role')
            ->persist();

        $aggregate = RoleAggregate::retrieve('role-4')
            ->destroy();

        expect($aggregate->getRecordedEvents())->toHaveCount(1);
        expect($aggregate->getRecordedEvents()[0])->toBeInstanceOf(RoleDestroyed::class);
    });
});

describe('Policy Attachments', function () {
    it('records policy attached event', function () {
        $aggregate = RoleAggregate::retrieve('role-5')
            ->attachPolicy('App\\Policies\\UserPolicy', 'view', 'View users', false);

        expect($aggregate->getRecordedEvents())->toHaveCount(1);
        expect($aggregate->getRecordedEvents()[0])->toBeInstanceOf(PolicyAttached::class)
            ->policy->toBe('App\\Policies\\UserPolicy')
            ->ability->toBe('view')
            ->description->toBe('View users')
            ->hidden->toBeFalse();
    });

    it('records multiple policy attachments', function () {
        $aggregate = RoleAggregate::retrieve('role-6')
            ->attachPolicy('App\\Policies\\UserPolicy', 'view')
            ->attachPolicy('App\\Policies\\OrderPolicy', 'create')
            ->attachPolicy('App\\Policies\\ReportPolicy', 'view');

        expect($aggregate->getRecordedEvents())->toHaveCount(3);
        expect($aggregate->getRecordedEvents()[0])->toBeInstanceOf(PolicyAttached::class)
            ->policy->toBe('App\\Policies\\UserPolicy');
        expect($aggregate->getRecordedEvents()[1])->toBeInstanceOf(PolicyAttached::class)
            ->policy->toBe('App\\Policies\\OrderPolicy');
        expect($aggregate->getRecordedEvents()[2])->toBeInstanceOf(PolicyAttached::class)
            ->policy->toBe('App\\Policies\\ReportPolicy');
    });

    it('attaches same policy to different abilities', function () {
        $aggregate = RoleAggregate::retrieve('role-7')
            ->attachPolicy('App\\Policies\\UserPolicy', 'view')
            ->attachPolicy('App\\Policies\\UserPolicy', 'create')
            ->attachPolicy('App\\Policies\\UserPolicy', 'update');

        expect($aggregate->getRecordedEvents())->toHaveCount(3);
        expect($aggregate->getRecordedEvents()[0])->toBeInstanceOf(PolicyAttached::class)
            ->ability->toBe('view');
        expect($aggregate->getRecordedEvents()[1])->toBeInstanceOf(PolicyAttached::class)
            ->ability->toBe('create');
        expect($aggregate->getRecordedEvents()[2])->toBeInstanceOf(PolicyAttached::class)
            ->ability->toBe('update');
    });
});

describe('Policy Detachments', function () {
    it('records policy detached event', function () {
        $aggregate = RoleAggregate::retrieve('role-8');

        // Manually set the attached policies to simulate retrieved state
        $aggregate->attachedPolicies = [['App\\Policies\\UserPolicy', 'view']];

        $aggregate->detachPolicy('App\\Policies\\UserPolicy', 'view');

        expect($aggregate->getRecordedEvents())->toHaveCount(1);
        expect($aggregate->getRecordedEvents()[0])->toBeInstanceOf(PolicyDetached::class)
            ->policy->toBe('App\\Policies\\UserPolicy')
            ->ability->toBe('view');
    });

    it('prevents detaching non-attached policies', function () {
        $aggregate = RoleAggregate::retrieve('role-9')
            ->detachPolicy('App\\Policies\\UserPolicy', 'view');

        expect($aggregate->getRecordedEvents())->toHaveCount(0);
    });

    it('records multiple detachments', function () {
        $aggregate = RoleAggregate::retrieve('role-10');

        // Manually set the attached policies to simulate retrieved state
        $aggregate->attachedPolicies = [
            ['App\\Policies\\UserPolicy', 'view'],
            ['App\\Policies\\OrderPolicy', 'create'],
            ['App\\Policies\\ReportPolicy', 'view'],
        ];

        $aggregate->detachPolicy('App\\Policies\\UserPolicy', 'view')
            ->detachPolicy('App\\Policies\\ReportPolicy', 'view');

        $events = $aggregate->getRecordedEvents();
        expect($events)->toHaveCount(2);

        expect($events[0])->toBeInstanceOf(PolicyDetached::class)
            ->policy->toBe('App\\Policies\\UserPolicy');
        expect($events[1])->toBeInstanceOf(PolicyDetached::class)
            ->policy->toBe('App\\Policies\\ReportPolicy');
    });
});

describe('Policy Deprecation', function () {
    it('records policy deprecated event', function () {
        $aggregate = RoleAggregate::retrieve('role-11')
            ->deprecatePolicy('App\\Policies\\UserPolicy', 'view');

        expect($aggregate->getRecordedEvents())->toHaveCount(1);
        expect($aggregate->getRecordedEvents()[0])->toBeInstanceOf(PolicyDeprecated::class)
            ->policy->toBe('App\\Policies\\UserPolicy')
            ->ability->toBe('view');
    });
});
