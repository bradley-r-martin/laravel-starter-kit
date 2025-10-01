<?php

declare(strict_types=1);

use App\Aggregates\UserAggregate;
use App\Events\User\UserLoggedIn;
use Spatie\EventSourcing\AggregateRoots\AggregateRoot;

it('can record user login', function () {
    $aggregate = UserAggregate::retrieve('user-1');

    $timestamp = new DateTimeImmutable('2025-10-01 12:00:00');

    $aggregate->login(
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        timestamp: $timestamp,
        remember: true
    );

    expect($aggregate)->toBeInstanceOf(AggregateRoot::class);
    expect($aggregate->getRecordedEvents())->toHaveCount(1);

    $event = $aggregate->getRecordedEvents()[0];
    expect($event)->toBeInstanceOf(UserLoggedIn::class);
    expect($event->ipAddress)->toBe('192.168.1.1');
    expect($event->userAgent)->toBe('Mozilla/5.0');
    expect($event->timestamp)->toBe($timestamp);
    expect($event->remember)->toBeTrue();
});

it('tracks multiple login events', function () {
    $aggregate = UserAggregate::retrieve('user-1');

    $timestamp1 = new DateTimeImmutable('2025-10-01 12:00:00');
    $timestamp2 = new DateTimeImmutable('2025-10-01 13:00:00');
    $timestamp3 = new DateTimeImmutable('2025-10-01 14:00:00');

    $aggregate->login(
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        timestamp: $timestamp1
    );

    $aggregate->login(
        ipAddress: '192.168.1.2',
        userAgent: 'Chrome/120.0',
        timestamp: $timestamp2
    );

    $aggregate->login(
        ipAddress: '192.168.1.3',
        userAgent: 'Safari/17.0',
        timestamp: $timestamp3
    );

    $events = $aggregate->getRecordedEvents();

    expect($events)->toHaveCount(3);

    expect($events[0])->toBeInstanceOf(UserLoggedIn::class)
        ->ipAddress->toBe('192.168.1.1')
        ->userAgent->toBe('Mozilla/5.0')
        ->timestamp->toBe($timestamp1);

    expect($events[1])->toBeInstanceOf(UserLoggedIn::class)
        ->ipAddress->toBe('192.168.1.2')
        ->userAgent->toBe('Chrome/120.0')
        ->timestamp->toBe($timestamp2);

    expect($events[2])->toBeInstanceOf(UserLoggedIn::class)
        ->ipAddress->toBe('192.168.1.3')
        ->userAgent->toBe('Safari/17.0')
        ->timestamp->toBe($timestamp3);
});

it('handles remember flag correctly', function () {
    $aggregate = UserAggregate::retrieve('user-3');

    $timestamp = new DateTimeImmutable;

    // Test with remember = false
    $aggregate->login(
        ipAddress: '127.0.0.1',
        userAgent: 'Test Agent',
        timestamp: $timestamp,
        remember: false
    );

    $event = $aggregate->getRecordedEvents()[0];
    expect($event->remember)->toBeFalse();
});

it('records multiple logins with different ip addresses', function () {
    $aggregate = UserAggregate::retrieve('user-4');

    $timestamp = new DateTimeImmutable;

    $aggregate->login(
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        timestamp: $timestamp
    );

    $aggregate->login(
        ipAddress: '10.0.0.1',
        userAgent: 'Chrome/120.0',
        timestamp: $timestamp
    );

    $events = $aggregate->getRecordedEvents();

    expect($events)->toHaveCount(2);
    expect($events[0]->ipAddress)->toBe('192.168.1.1');
    expect($events[1]->ipAddress)->toBe('10.0.0.1');
});
