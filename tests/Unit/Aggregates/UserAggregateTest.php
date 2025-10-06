<?php

declare(strict_types=1);

use App\Aggregates\UserAggregate;
use App\Events\User\UserClosed;
use App\Events\User\UserCreated;
use App\Events\User\UserDestroyed;
use App\Events\User\UserLoggedIn;
use App\Events\User\UserPasswordChanged;
use App\Events\User\UserRecoveryRequested;
use App\Events\User\UserReopened;
use App\Events\User\UserSuspended;
use App\Events\User\UserUnsuspended;
use App\Events\User\UserUpdated;

describe('User Creation', function () {
    it('records user creation event', function () {
        $hashedPassword = '$2y$12$abcdefghijklmnopqrstuv';

        $aggregate = UserAggregate::retrieve('user-0')
            ->create(
                operatorId: 'operator-1',
                roleId: 'role-1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: $hashedPassword
            );

        expect($aggregate->getRecordedEvents())->toHaveCount(1);

        $event = $aggregate->getRecordedEvents()[0];
        expect($event)->toBeInstanceOf(UserCreated::class)
            ->operatorId->toBe('operator-1')
            ->roleId->toBe('role-1')
            ->firstName->toBe('John')
            ->lastName->toBe('Doe')
            ->email->toBe('john.doe@example.com')
            ->password->toBe($hashedPassword);
    });

    it('records user creation with null role', function () {
        $hashedPassword = '$2y$12$xyz123456789abcdefghij';

        $aggregate = UserAggregate::retrieve('user-00')
            ->create(
                operatorId: 'operator-1',
                roleId: 'role-1',
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@example.com',
                password: $hashedPassword
            );

        expect($aggregate->getRecordedEvents())->toHaveCount(1);

        $event = $aggregate->getRecordedEvents()[0];
        expect($event)->toBeInstanceOf(UserCreated::class)
            ->operatorId->toBe('operator-1')
            ->roleId->toBe('role-1')
            ->firstName->toBe('Jane')
            ->lastName->toBe('Smith')
            ->password->toBe($hashedPassword);
    });
});

describe('User Login', function () {
    it('records user login event', function () {
        $timestamp = new DateTimeImmutable('2025-10-01 12:00:00');

        $aggregate = UserAggregate::retrieve('user-1')
            ->login(
                ipAddress: '192.168.1.1',
                userAgent: 'Mozilla/5.0',
                timestamp: $timestamp,
                remember: true
            );

        expect($aggregate->getRecordedEvents())->toHaveCount(1);

        $event = $aggregate->getRecordedEvents()[0];
        expect($event)->toBeInstanceOf(UserLoggedIn::class)
            ->ipAddress->toBe('192.168.1.1')
            ->userAgent->toBe('Mozilla/5.0')
            ->timestamp->toBe($timestamp)
            ->remember->toBeTrue();
    });

    it('records login without remember flag', function () {
        $timestamp = new DateTimeImmutable('2025-10-01 12:00:00');

        $aggregate = UserAggregate::retrieve('user-2')
            ->login(
                ipAddress: '192.168.1.1',
                userAgent: 'Mozilla/5.0',
                timestamp: $timestamp,
                remember: false
            );

        expect($aggregate->getRecordedEvents())->toHaveCount(1);

        $event = $aggregate->getRecordedEvents()[0];
        expect($event)->toBeInstanceOf(UserLoggedIn::class)
            ->remember->toBeFalse();
    });

    it('records multiple login events', function () {
        $timestamp1 = new DateTimeImmutable('2025-10-01 12:00:00');
        $timestamp2 = new DateTimeImmutable('2025-10-01 13:00:00');
        $timestamp3 = new DateTimeImmutable('2025-10-01 14:00:00');

        $aggregate = UserAggregate::retrieve('user-3')
            ->login(ipAddress: '192.168.1.1', userAgent: 'Mozilla/5.0', timestamp: $timestamp1)
            ->login(ipAddress: '192.168.1.2', userAgent: 'Chrome/120.0', timestamp: $timestamp2)
            ->login(ipAddress: '192.168.1.3', userAgent: 'Safari/17.0', timestamp: $timestamp3);

        $events = $aggregate->getRecordedEvents();
        expect($events)->toHaveCount(3);

        expect($events[0])->toBeInstanceOf(UserLoggedIn::class)
            ->ipAddress->toBe('192.168.1.1');
        expect($events[1])->toBeInstanceOf(UserLoggedIn::class)
            ->ipAddress->toBe('192.168.1.2');
        expect($events[2])->toBeInstanceOf(UserLoggedIn::class)
            ->ipAddress->toBe('192.168.1.3');
    });
});

describe('Password Recovery', function () {
    it('records recovery request event', function () {
        $timestamp = new DateTimeImmutable('2025-10-01 12:00:00');

        $aggregate = UserAggregate::retrieve('user-4')
            ->requestRecovery(
                email: 'user@example.com',
                ipAddress: '192.168.1.1',
                userAgent: 'Mozilla/5.0',
                timestamp: $timestamp
            );

        expect($aggregate->getRecordedEvents())->toHaveCount(1);

        $event = $aggregate->getRecordedEvents()[0];
        expect($event)->toBeInstanceOf(UserRecoveryRequested::class)
            ->email->toBe('user@example.com')
            ->ipAddress->toBe('192.168.1.1')
            ->userAgent->toBe('Mozilla/5.0')
            ->timestamp->toBe($timestamp);
    });

    it('records multiple recovery requests', function () {
        $timestamp1 = new DateTimeImmutable('2025-10-01 12:00:00');
        $timestamp2 = new DateTimeImmutable('2025-10-01 13:00:00');

        $aggregate = UserAggregate::retrieve('user-5')
            ->requestRecovery(
                email: 'user@example.com',
                ipAddress: '192.168.1.1',
                userAgent: 'Mozilla/5.0',
                timestamp: $timestamp1
            )
            ->requestRecovery(
                email: 'user@example.com',
                ipAddress: '192.168.1.2',
                userAgent: 'Chrome/120.0',
                timestamp: $timestamp2
            );

        $events = $aggregate->getRecordedEvents();
        expect($events)->toHaveCount(2);

        expect($events[0])->toBeInstanceOf(UserRecoveryRequested::class)
            ->ipAddress->toBe('192.168.1.1');
        expect($events[1])->toBeInstanceOf(UserRecoveryRequested::class)
            ->ipAddress->toBe('192.168.1.2');
    });
});

describe('User Update', function () {
    it('records user update event', function () {
        $aggregate = UserAggregate::retrieve('user-6')
            ->update(
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@example.com'
            );

        expect($aggregate->getRecordedEvents())->toHaveCount(1);

        $event = $aggregate->getRecordedEvents()[0];
        expect($event)->toBeInstanceOf(UserUpdated::class)
            ->firstName->toBe('Jane')
            ->lastName->toBe('Smith')
            ->email->toBe('jane.smith@example.com');
    });

    it('can chain creation and update events', function () {
        $aggregate = UserAggregate::retrieve('user-7')
            ->create(
                operatorId: 'operator-1',
                roleId: 'role-1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: '$2y$12$test'
            )
            ->update(
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@example.com'
            );

        $events = $aggregate->getRecordedEvents();
        expect($events)->toHaveCount(2);
        expect($events[0])->toBeInstanceOf(UserCreated::class);
        expect($events[1])->toBeInstanceOf(UserUpdated::class)
            ->firstName->toBe('Jane')
            ->lastName->toBe('Smith')
            ->email->toBe('jane.smith@example.com');
    });

    it('records multiple update events', function () {
        $aggregate = UserAggregate::retrieve('user-8')
            ->update(
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com'
            )
            ->update(
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@example.com'
            );

        $events = $aggregate->getRecordedEvents();
        expect($events)->toHaveCount(2);

        expect($events[0])->toBeInstanceOf(UserUpdated::class)
            ->firstName->toBe('John');
        expect($events[1])->toBeInstanceOf(UserUpdated::class)
            ->firstName->toBe('Jane');
    });
});

describe('User Suspension', function () {
    it('records user suspension event', function () {
        $aggregate = UserAggregate::retrieve('user-9')
            ->suspend(
                reason: 'Policy violation'
            );

        expect($aggregate->getRecordedEvents())->toHaveCount(1);

        $event = $aggregate->getRecordedEvents()[0];
        expect($event)->toBeInstanceOf(UserSuspended::class)
            ->reason->toBe('Policy violation')
            ->notify->toBeFalse();
    });

    it('records user suspension event with notification', function () {
        $aggregate = UserAggregate::retrieve('user-9b')
            ->suspend(
                reason: 'Policy violation',
                notify: true
            );

        expect($aggregate->getRecordedEvents())->toHaveCount(1);

        $event = $aggregate->getRecordedEvents()[0];
        expect($event)->toBeInstanceOf(UserSuspended::class)
            ->reason->toBe('Policy violation')
            ->notify->toBeTrue();
    });

    it('can suspend a user multiple times', function () {
        $aggregate = UserAggregate::retrieve('user-10')
            ->suspend(
                reason: 'First suspension'
            )
            ->suspend(
                reason: 'Second suspension'
            );

        $events = $aggregate->getRecordedEvents();
        expect($events)->toHaveCount(2);

        expect($events[0])->toBeInstanceOf(UserSuspended::class)
            ->reason->toBe('First suspension');
        expect($events[1])->toBeInstanceOf(UserSuspended::class)
            ->reason->toBe('Second suspension');
    });

    it('can chain creation and suspension events', function () {
        $aggregate = UserAggregate::retrieve('user-11')
            ->create(
                operatorId: 'operator-1',
                roleId: 'role-1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: '$2y$12$test'
            )
            ->suspend(
                reason: 'Immediate suspension after creation'
            );

        $events = $aggregate->getRecordedEvents();
        expect($events)->toHaveCount(2);
        expect($events[0])->toBeInstanceOf(UserCreated::class);
        expect($events[1])->toBeInstanceOf(UserSuspended::class)
            ->reason->toBe('Immediate suspension after creation');
    });
});

describe('User Unsuspension', function () {
    it('records user unsuspension event', function () {
        $aggregate = UserAggregate::retrieve('user-12')
            ->unsuspend(
                reason: 'Suspension lifted'
            );

        expect($aggregate->getRecordedEvents())->toHaveCount(1);

        $event = $aggregate->getRecordedEvents()[0];
        expect($event)->toBeInstanceOf(UserUnsuspended::class)
            ->reason->toBe('Suspension lifted')
            ->notify->toBeFalse();
    });

    it('records user unsuspension event with notification', function () {
        $aggregate = UserAggregate::retrieve('user-13')
            ->unsuspend(
                reason: 'Suspension lifted',
                notify: true
            );

        expect($aggregate->getRecordedEvents())->toHaveCount(1);

        $event = $aggregate->getRecordedEvents()[0];
        expect($event)->toBeInstanceOf(UserUnsuspended::class)
            ->reason->toBe('Suspension lifted')
            ->notify->toBeTrue();
    });

    it('can suspend and then unsuspend a user', function () {
        $aggregate = UserAggregate::retrieve('user-14')
            ->suspend(
                reason: 'Temporary suspension'
            )
            ->unsuspend(
                reason: 'Issue resolved'
            );

        $events = $aggregate->getRecordedEvents();
        expect($events)->toHaveCount(2);

        expect($events[0])->toBeInstanceOf(UserSuspended::class)
            ->reason->toBe('Temporary suspension');
        expect($events[1])->toBeInstanceOf(UserUnsuspended::class)
            ->reason->toBe('Issue resolved');
    });
});

describe('User Closure', function () {
    it('records user closure event', function () {
        $aggregate = UserAggregate::retrieve('user-15')
            ->close(
                reason: 'Employee left company'
            );

        expect($aggregate->getRecordedEvents())->toHaveCount(1);

        $event = $aggregate->getRecordedEvents()[0];
        expect($event)->toBeInstanceOf(UserClosed::class)
            ->reason->toBe('Employee left company');
    });

    it('can close a user after creation', function () {
        $aggregate = UserAggregate::retrieve('user-16')
            ->create(
                operatorId: 'operator-1',
                roleId: 'role-1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: '$2y$12$test'
            )
            ->close(
                reason: 'Account no longer needed'
            );

        $events = $aggregate->getRecordedEvents();
        expect($events)->toHaveCount(2);
        expect($events[0])->toBeInstanceOf(UserCreated::class);
        expect($events[1])->toBeInstanceOf(UserClosed::class)
            ->reason->toBe('Account no longer needed');
    });

    it('can close a suspended user', function () {
        $aggregate = UserAggregate::retrieve('user-17')
            ->suspend(
                reason: 'Policy violation'
            )
            ->close(
                reason: 'Repeated violations'
            );

        $events = $aggregate->getRecordedEvents();
        expect($events)->toHaveCount(2);

        expect($events[0])->toBeInstanceOf(UserSuspended::class);
        expect($events[1])->toBeInstanceOf(UserClosed::class)
            ->reason->toBe('Repeated violations');
    });
});

describe('User Reopening', function () {
    it('records user reopening event', function () {
        $aggregate = UserAggregate::retrieve('user-18')
            ->reopen(
                reason: 'Employee returned to company'
            );

        expect($aggregate->getRecordedEvents())->toHaveCount(1);

        $event = $aggregate->getRecordedEvents()[0];
        expect($event)->toBeInstanceOf(UserReopened::class)
            ->reason->toBe('Employee returned to company');
    });

    it('can close and then reopen a user', function () {
        $aggregate = UserAggregate::retrieve('user-19')
            ->close(
                reason: 'Employee left company'
            )
            ->reopen(
                reason: 'Employee returned to company'
            );

        $events = $aggregate->getRecordedEvents();
        expect($events)->toHaveCount(2);

        expect($events[0])->toBeInstanceOf(UserClosed::class)
            ->reason->toBe('Employee left company');
        expect($events[1])->toBeInstanceOf(UserReopened::class)
            ->reason->toBe('Employee returned to company');
    });

    it('can reopen a user after creation and closure', function () {
        $aggregate = UserAggregate::retrieve('user-20')
            ->create(
                operatorId: 'operator-1',
                roleId: 'role-1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: '$2y$12$test'
            )
            ->close(
                reason: 'Account closed temporarily'
            )
            ->reopen(
                reason: 'Account reactivated'
            );

        $events = $aggregate->getRecordedEvents();
        expect($events)->toHaveCount(3);
        expect($events[0])->toBeInstanceOf(UserCreated::class);
        expect($events[1])->toBeInstanceOf(UserClosed::class);
        expect($events[2])->toBeInstanceOf(UserReopened::class)
            ->reason->toBe('Account reactivated');
    });
});

describe('User Destruction', function () {
    it('records user destruction event', function () {
        $aggregate = UserAggregate::retrieve('user-21')
            ->destroy(
                reason: 'Account no longer needed'
            );

        expect($aggregate->getRecordedEvents())->toHaveCount(1);

        $event = $aggregate->getRecordedEvents()[0];
        expect($event)->toBeInstanceOf(UserDestroyed::class)
            ->reason->toBe('Account no longer needed');
    });

    it('can close and then destroy a user', function () {
        $aggregate = UserAggregate::retrieve('user-22')
            ->close(
                reason: 'Employee left company'
            )
            ->destroy(
                reason: 'Permanent removal requested'
            );

        $events = $aggregate->getRecordedEvents();
        expect($events)->toHaveCount(2);

        expect($events[0])->toBeInstanceOf(UserClosed::class)
            ->reason->toBe('Employee left company');
        expect($events[1])->toBeInstanceOf(UserDestroyed::class)
            ->reason->toBe('Permanent removal requested');
    });

    it('can destroy a user after creation and closure', function () {
        $aggregate = UserAggregate::retrieve('user-23')
            ->create(
                operatorId: 'operator-1',
                roleId: 'role-1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: '$2y$12$test'
            )
            ->close(
                reason: 'Account closed for review'
            )
            ->destroy(
                reason: 'Final removal approved'
            );

        $events = $aggregate->getRecordedEvents();
        expect($events)->toHaveCount(3);
        expect($events[0])->toBeInstanceOf(UserCreated::class);
        expect($events[1])->toBeInstanceOf(UserClosed::class);
        expect($events[2])->toBeInstanceOf(UserDestroyed::class)
            ->reason->toBe('Final removal approved');
    });
});

describe('User Password Change', function () {
    it('records user password change event', function () {
        $newHashedPassword = '$2y$12$newhashedpassword123456789';

        $aggregate = UserAggregate::retrieve('user-24')
            ->changePassword(
                hashedPassword: $newHashedPassword
            );

        expect($aggregate->getRecordedEvents())->toHaveCount(1);

        $event = $aggregate->getRecordedEvents()[0];
        expect($event)->toBeInstanceOf(UserPasswordChanged::class)
            ->hashedPassword->toBe($newHashedPassword);
    });

    it('can change password after creation', function () {
        $aggregate = UserAggregate::retrieve('user-25')
            ->create(
                operatorId: 'operator-1',
                roleId: 'role-1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: '$2y$12$initial'
            )
            ->changePassword(
                hashedPassword: '$2y$12$newpassword'
            );

        $events = $aggregate->getRecordedEvents();
        expect($events)->toHaveCount(2);
        expect($events[0])->toBeInstanceOf(UserCreated::class);
        expect($events[1])->toBeInstanceOf(UserPasswordChanged::class)
            ->hashedPassword->toBe('$2y$12$newpassword');
    });

    it('can change password multiple times', function () {
        $aggregate = UserAggregate::retrieve('user-26')
            ->changePassword(
                hashedPassword: '$2y$12$password1'
            )
            ->changePassword(
                hashedPassword: '$2y$12$password2'
            )
            ->changePassword(
                hashedPassword: '$2y$12$password3'
            );

        $events = $aggregate->getRecordedEvents();
        expect($events)->toHaveCount(3);
        expect($events[0])->toBeInstanceOf(UserPasswordChanged::class)
            ->hashedPassword->toBe('$2y$12$password1');
        expect($events[1])->toBeInstanceOf(UserPasswordChanged::class)
            ->hashedPassword->toBe('$2y$12$password2');
        expect($events[2])->toBeInstanceOf(UserPasswordChanged::class)
            ->hashedPassword->toBe('$2y$12$password3');
    });
});
