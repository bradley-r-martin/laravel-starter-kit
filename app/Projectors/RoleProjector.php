<?php

declare(strict_types=1);

namespace App\Projectors;

use App\Events\Role\RoleClosed;
use App\Events\Role\RoleCreated;
use App\Events\Role\RoleUpdated;
use App\Models\Role;
use Spatie\EventSourcing\EventHandlers\Projectors\Projector;
use Spatie\EventSourcing\StoredEvents\StoredEvent;

final class RoleProjector extends Projector
{
    private ?string $aggregateUuid = null;

    public function handle(StoredEvent $storedEvent): void
    {
        $this->aggregateUuid = $storedEvent->aggregate_uuid;

        parent::handle($storedEvent);
    }

    public function onRoleCreated(RoleCreated $event): void
    {
        Role::create([
            'id' => $this->aggregateUuid,
            'name' => $event->name,
            'description' => $event->description,
            'hidden' => $event->hidden,
        ]);
    }

    public function onRoleUpdated(RoleUpdated $event): void
    {
        $role = Role::findOrFail($this->aggregateUuid);

        $updateData = [];

        if ($event->name !== null) {
            $updateData['name'] = $event->name;
        }

        if ($event->description !== null) {
            $updateData['description'] = $event->description;
        }

        if ($event->hidden !== null) {
            $updateData['hidden'] = $event->hidden;
        }

        if ($updateData !== []) {
            $role->update($updateData);
        }
    }

    public function onRoleClosed(RoleClosed $event): void
    {
        $role = Role::findOrFail($this->aggregateUuid);

        $role->update([
            'closed_at' => now(),
        ]);
    }
}
