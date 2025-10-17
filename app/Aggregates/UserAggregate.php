<?php

declare(strict_types=1);

namespace App\Aggregates;

use App\Domain\File;
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
use DateTimeImmutable;
use Spatie\EventSourcing\AggregateRoots\AggregateRoot;

final class UserAggregate extends AggregateRoot
{
    public string $password;

    public ?string $operatorId = null;

    public ?string $roleId = null;

    public ?string $firstName = null;

    public ?string $lastName = null;

    public ?string $email = null;

    public ?File $avatar = null;

    public ?DateTimeImmutable $lastLoginAt = null;

    public ?string $lastLoginIpAddress = null;

    public ?string $lastLoginUserAgent = null;

    public int $loginCount = 0;

    public ?DateTimeImmutable $lastRecoveryRequestedAt = null;

    public int $recoveryRequestCount = 0;

    public ?DateTimeImmutable $suspendedAt = null;

    public ?string $suspendedReason = null;

    public ?DateTimeImmutable $closedAt = null;

    public ?string $closedReason = null;

    public ?DateTimeImmutable $destroyedAt = null;

    public ?string $destroyedReason = null;

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
        ?string $firstName = null,
        ?string $lastName = null,
        ?string $email = null,
        ?File $avatar = null,
    ): self {

        $this->recordThat(new UserUpdated(
            firstName: $firstName,
            lastName: $lastName,
            email: $email,
            avatar: $avatar,
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

    public function close(
        string $reason,
    ): self {
        $this->recordThat(new UserClosed(
            reason: $reason,
        ));

        return $this;
    }

    public function reopen(
        string $reason,
    ): self {
        $this->recordThat(new UserReopened(
            reason: $reason,
        ));

        return $this;
    }

    public function destroy(
        string $reason,
    ): self {
        $this->recordThat(new UserDestroyed(
            reason: $reason,
        ));

        return $this;
    }

    public function changePassword(
        string $hashedPassword,
    ): self {
        $this->recordThat(new UserPasswordChanged(
            hashedPassword: $hashedPassword,
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
        if ($event->firstName !== null) {
            $this->firstName = $event->firstName;
        }

        if ($event->lastName !== null) {
            $this->lastName = $event->lastName;
        }

        if ($event->email !== null) {
            $this->email = $event->email;
        }

        if ($event->avatar instanceof File) {
            $this->avatar = $event->avatar;
        }
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

    /**
     * @phpstan-ignore-next-line
     */
    private function applyUserClosed(UserClosed $event): void
    {
        $this->closedAt = new DateTimeImmutable();
        $this->closedReason = $event->reason;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyUserReopened(): void
    {
        $this->closedAt = null;
        $this->closedReason = null;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyUserDestroyed(UserDestroyed $event): void
    {
        $this->destroyedAt = new DateTimeImmutable();
        $this->destroyedReason = $event->reason;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyUserPasswordChanged(UserPasswordChanged $event): void
    {
        $this->password = $event->hashedPassword;
    }
}
