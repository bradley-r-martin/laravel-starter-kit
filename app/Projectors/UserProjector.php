<?php

declare(strict_types=1);

namespace App\Projectors;

use App\Events\User\UserCreated;
use App\Events\User\UserLoggedIn;
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
        $operator = Operator::findOrFail($event->operatorId);

        $user->update([
            'operator_id' => $event->operatorId,
            'role_id' => $event->roleId,
            'first_name' => $event->firstName,
            'last_name' => $event->lastName,
            'email' => $event->email,
            '__operator_name' => $operator->name,
        ]);
    }
}
