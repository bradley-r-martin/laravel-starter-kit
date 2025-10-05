<?php

declare(strict_types=1);

namespace App\Reactors;

use App\Events\User\UserSuspended;
use App\Models\User;
use App\Notifications\UserSuspensionNotification;
use Spatie\EventSourcing\EventHandlers\Reactors\Reactor;
use Spatie\EventSourcing\StoredEvents\StoredEvent;

final class UserReactor extends Reactor
{
    private ?string $aggregateUuid = null;

    public function handle(StoredEvent $storedEvent): void
    {
        $this->aggregateUuid = $storedEvent->aggregate_uuid;

        parent::handle($storedEvent);
    }

    public function onUserSuspended(UserSuspended $event): void
    {
        // Only send notification if the notify flag is true
        if (! $event->notify) {
            return;
        }

        // Find the user by UUID
        $user = User::query()->where('id', $this->aggregateUuid)->first();

        if (! $user) {
            return;
        }

        // Send the suspension notification
        $user->notify(new UserSuspensionNotification($event->reason));
    }
}
