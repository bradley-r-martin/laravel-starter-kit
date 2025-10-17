<?php

declare(strict_types=1);

namespace App\Projectors;

use App\Events\User\UserClosed;
use App\Events\User\UserCreated;
use App\Events\User\UserDestroyed;
use App\Events\User\UserLoggedIn;
use App\Events\User\UserPasswordChanged;
use App\Events\User\UserReopened;
use App\Events\User\UserSuspended;
use App\Events\User\UserUnsuspended;
use App\Events\User\UserUpdated;
use App\Models\Operator;
use App\Models\User;
use Spatie\EventSourcing\EventHandlers\Projectors\Projector;
use Spatie\EventSourcing\StoredEvents\StoredEvent;

final class UserProjector extends Projector
{
    private ?string $aggregateUuid = null;

    public function handle(StoredEvent $storedEvent): void
    {
        $this->aggregateUuid = $storedEvent->aggregate_uuid;

        parent::handle($storedEvent);
    }

    public function onUserCreated(UserCreated $event): void
    {
        $operator = Operator::findOrFail($event->operatorId);

        User::create([
            'id' => $this->aggregateUuid,
            'operator_id' => $event->operatorId,
            'role_id' => $event->roleId,
            'first_name' => $event->firstName,
            'last_name' => $event->lastName,
            'email' => $event->email,
            'password' => $event->password,
            '__operator_name' => $operator->name,
        ]);
    }

    public function onUserLoggedIn(UserLoggedIn $event): void
    {
        $user = User::findOrFail($this->aggregateUuid);

        $user->update([
            '__last_login_at' => $event->timestamp,
            '__last_login_ip' => $event->ipAddress,
            '__last_login_user_agent' => $event->userAgent,
        ]);
    }

    public function onUserUpdated(UserUpdated $event): void
    {
        $user = User::findOrFail($this->aggregateUuid);

        $updates = [];

        if ($event->firstName !== null) {
            $updates['first_name'] = $event->firstName;
        }

        if ($event->lastName !== null) {
            $updates['last_name'] = $event->lastName;
        }

        if ($event->email !== null) {
            $updates['email'] = $event->email;
        }

        if ($event->avatar instanceof \App\Domain\File) {
            $updates['avatar'] = $event->avatar;
        }

        if ($updates !== []) {
            $user->update($updates);
        }
    }

    public function onUserSuspended(UserSuspended $event): void
    {
        $user = User::findOrFail($this->aggregateUuid);

        $user->update([
            'suspended_at' => now(),
        ]);
    }

    public function onUserUnsuspended(UserUnsuspended $event): void
    {
        $user = User::findOrFail($this->aggregateUuid);

        $user->update([
            'suspended_at' => null,
        ]);
    }

    public function onUserClosed(UserClosed $event): void
    {
        $user = User::findOrFail($this->aggregateUuid);

        $user->update([
            'closed_at' => now(),
        ]);
    }

    public function onUserReopened(UserReopened $event): void
    {
        $user = User::findOrFail($this->aggregateUuid);

        $user->update([
            'closed_at' => null,
        ]);
    }

    public function onUserDestroyed(UserDestroyed $event): void
    {
        $user = User::findOrFail($this->aggregateUuid);

        $user->delete();
    }

    public function onUserPasswordChanged(UserPasswordChanged $event): void
    {
        $user = User::findOrFail($this->aggregateUuid);

        $user->update([
            'password' => $event->hashedPassword,
        ]);
    }
}
