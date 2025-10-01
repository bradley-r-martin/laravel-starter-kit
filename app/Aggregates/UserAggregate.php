<?php

declare(strict_types=1);

namespace App\Aggregates;

use App\Events\User\UserLoggedIn;
use DateTimeImmutable;
use Spatie\EventSourcing\AggregateRoots\AggregateRoot;

final class UserAggregate extends AggregateRoot
{
    public ?DateTimeImmutable $lastLoginAt = null;

    public ?string $lastLoginIpAddress = null;

    public ?string $lastLoginUserAgent = null;

    public int $loginCount = 0;

    public function login(
        string $ipAddress,
        string $userAgent,
        DateTimeImmutable $timestamp,
        bool $remember = true,
    ): self {
        $this->recordThat(new UserLoggedIn(
            ipAddress: $ipAddress,
            userAgent: $userAgent,
            timestamp: $timestamp,
            remember: $remember,
        ));

        return $this;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyUserLoggedIn(UserLoggedIn $event): void
    {
        $this->lastLoginAt = $event->timestamp;
        $this->lastLoginIpAddress = $event->ipAddress;
        $this->lastLoginUserAgent = $event->userAgent;
        $this->loginCount++;
    }
}
