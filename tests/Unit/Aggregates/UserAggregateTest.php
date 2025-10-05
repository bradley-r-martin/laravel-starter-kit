<?php

declare(strict_types=1);

use App\Aggregates\UserAggregate;
use App\Events\User\UserLoggedIn;
use App\Events\User\UserRecoveryRequested;

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
