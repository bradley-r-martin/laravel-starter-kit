<?php

declare(strict_types=1);

namespace App\Projectors;

use App\Events\User\UserLoggedIn;
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

    public function onUserLoggedIn(UserLoggedIn $event): void
    {
        $user = User::findOrFail($this->aggregateUuid);

        $user->update([
            '__last_login_at' => $event->timestamp,
            '__last_login_ip' => $event->ipAddress,
            '__last_login_user_agent' => $event->userAgent,
        ]);
    }
}
