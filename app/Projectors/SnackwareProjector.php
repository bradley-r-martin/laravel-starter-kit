<?php

declare(strict_types=1);

namespace App\Projectors;

use App\Events\Snackware\SnackwareClosed;
use App\Events\Snackware\SnackwareCreated;
use App\Events\Snackware\SnackwareDestroyed;
use App\Events\Snackware\SnackwareReopened;
use App\Events\Snackware\SnackwareUpdated;
use App\Models\Snackware;
use Spatie\EventSourcing\EventHandlers\Projectors\Projector;
use Spatie\EventSourcing\StoredEvents\StoredEvent;

final class SnackwareProjector extends Projector
{
    private ?string $aggregateUuid = null;

    public function handle(StoredEvent $storedEvent): void
    {
        $this->aggregateUuid = $storedEvent->aggregate_uuid;

        parent::handle($storedEvent);
    }

    public function onSnackwareCreated(SnackwareCreated $event): void
    {
        Snackware::create([
            'id' => $this->aggregateUuid,
            'territory_id' => $event->territoryId,
            'operator_id' => $event->operatorId,
            'name' => $event->name,
            'type' => $event->type,
            'icon' => $event->icon,
            'price' => $event->price,
        ]);
    }

    public function onSnackwareUpdated(SnackwareUpdated $event): void
    {
        $snackware = Snackware::findOrFail($this->aggregateUuid);

        $updateData = [];

        if ($event->name !== null) {
            $updateData['name'] = $event->name;
        }

        if ($event->type !== null) {
            $updateData['type'] = $event->type;
        }

        if ($event->icon !== null) {
            $updateData['icon'] = $event->icon;
        }

        if ($event->price !== null) {
            $updateData['price'] = $event->price;
        }

        if ($updateData !== []) {
            $snackware->update($updateData);
        }
    }

    public function onSnackwareClosed(SnackwareClosed $event): void
    {
        $snackware = Snackware::findOrFail($this->aggregateUuid);

        $snackware->update([
            'closed_at' => now(),
        ]);
    }

    public function onSnackwareReopened(SnackwareReopened $event): void
    {
        $snackware = Snackware::findOrFail($this->aggregateUuid);

        $snackware->update([
            'closed_at' => null,
        ]);
    }

    public function onSnackwareDestroyed(SnackwareDestroyed $event): void
    {
        $snackware = Snackware::findOrFail($this->aggregateUuid);

        $snackware->delete();
    }
}
