<?php

declare(strict_types=1);

namespace App\Aggregates;

use App\Events\User\UserCreated;
use App\Events\User\UserLoggedIn;
use App\Events\User\UserRecoveryRequested;
use App\Events\User\UserSuspended;
use App\Events\User\UserUnsuspended;
use App\Events\User\UserUpdated;
use DateTimeImmutable;
use Spatie\EventSourcing\AggregateRoots\AggregateRoot;

final class UserAggregate extends AggregateRoot
{
    public ?string $operatorId = null;

    public ?string $roleId = null;

    public ?string $firstName = null;

    public ?string $lastName = null;

    public ?string $email = null;

    public ?DateTimeImmutable $lastLoginAt = null;

    public ?string $lastLoginIpAddress = null;

    public ?string $lastLoginUserAgent = null;

    public int $loginCount = 0;

    public ?DateTimeImmutable $lastRecoveryRequestedAt = null;

    public int $recoveryRequestCount = 0;

    public ?DateTimeImmutable $suspendedAt = null;

    public ?string $suspendedReason = null;

    public function create(
        string $operatorId,
        string $roleId,
        string $firstName,
        string $lastName,
        string $email,
        string $password,
    ): self {
        $this->recordThat(new UserCreated(
            operatorId: $operatorId,
            roleId: $roleId,
            firstName: $firstName,
            lastName: $lastName,
            email: $email,
            password: $password,
        ));

        return $this;
    }

    public function update(
        string $operatorId,
        string $roleId,
        string $firstName,
        string $lastName,
        string $email,
    ): self {
        $this->recordThat(new UserUpdated(
            operatorId: $operatorId,
            roleId: $roleId,
            firstName: $firstName,
            lastName: $lastName,
            email: $email,
        ));

        return $this;
    }

    public function suspend(
        string $reason,
        bool $notify = false,
    ): self {
        $this->recordThat(new UserSuspended(
            reason: $reason,
            notify: $notify,
        ));

        return $this;
    }

    public function unsuspend(
        string $reason,
        bool $notify = false,
    ): self {
        $this->recordThat(new UserUnsuspended(
            reason: $reason,
            notify: $notify,
        ));

        return $this;
    }

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

    public function requestRecovery(
        string $email,
        string $ipAddress,
        string $userAgent,
        DateTimeImmutable $timestamp,
    ): self {
        $this->recordThat(new UserRecoveryRequested(
            email: $email,
            ipAddress: $ipAddress,
            userAgent: $userAgent,
            timestamp: $timestamp,
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

    /**
     * @phpstan-ignore-next-line
     */
    private function applyUserRecoveryRequested(UserRecoveryRequested $event): void
    {
        $this->lastRecoveryRequestedAt = $event->timestamp;
        $this->recoveryRequestCount++;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyUserCreated(UserCreated $event): void
    {
        $this->operatorId = $event->operatorId;
        $this->roleId = $event->roleId;
        $this->firstName = $event->firstName;
        $this->lastName = $event->lastName;
        $this->email = $event->email;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyUserUpdated(UserUpdated $event): void
    {
        $this->operatorId = $event->operatorId;
        $this->roleId = $event->roleId;
        $this->firstName = $event->firstName;
        $this->lastName = $event->lastName;
        $this->email = $event->email;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyUserSuspended(UserSuspended $event): void
    {
        $this->suspendedAt = new DateTimeImmutable();
        $this->suspendedReason = $event->reason;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyUserUnsuspended(): void
    {
        $this->suspendedAt = null;
        $this->suspendedReason = null;
    }
}
