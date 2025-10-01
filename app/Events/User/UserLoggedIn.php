<?php

declare(strict_types=1);

namespace App\Events\User;

use DateTimeImmutable;
use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class UserLoggedIn extends ShouldBeStored
{
    public function __construct(
        public string $ipAddress,
        public string $userAgent,
        public DateTimeImmutable $timestamp,
        public bool $remember = true,
    ) {}
}
