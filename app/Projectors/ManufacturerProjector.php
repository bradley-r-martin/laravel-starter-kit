<?php

declare(strict_types=1);

namespace App\Projectors;

use App\Events\Manufacturer\ManufacturerClosed;
use App\Events\Manufacturer\ManufacturerCreated;
use App\Events\Manufacturer\ManufacturerDestroyed;
use App\Events\Manufacturer\ManufacturerReopened;
use App\Events\Manufacturer\ManufacturerUpdated;
use App\Models\Manufacturer;
use Spatie\EventSourcing\EventHandlers\Projectors\Projector;
use Spatie\EventSourcing\StoredEvents\StoredEvent;

final class ManufacturerProjector extends Projector
{
    private ?string $aggregateUuid = null;

    public function handle(StoredEvent $storedEvent): void
    {
        $this->aggregateUuid = $storedEvent->aggregate_uuid;

        parent::handle($storedEvent);
    }

    public function onManufacturerCreated(ManufacturerCreated $event): void
    {
        Manufacturer::create([
            'id' => $this->aggregateUuid,
            'name' => $event->name,
        ]);
    }

    public function onManufacturerUpdated(ManufacturerUpdated $event): void
    {
        $manufacturer = Manufacturer::findOrFail($this->aggregateUuid);

        $updates = [];

        if ($event->name !== null) {
            $updates['name'] = $event->name;
        }

        if ($updates !== []) {
            $manufacturer->update($updates);
        }
    }

    public function onManufacturerClosed(ManufacturerClosed $event): void
    {
        $manufacturer = Manufacturer::findOrFail($this->aggregateUuid);

        $manufacturer->update([
            'closed_at' => now(),
        ]);
    }

    public function onManufacturerReopened(ManufacturerReopened $event): void
    {
        $manufacturer = Manufacturer::findOrFail($this->aggregateUuid);

        $manufacturer->update([
            'closed_at' => null,
        ]);
    }

    public function onManufacturerDestroyed(ManufacturerDestroyed $event): void
    {
        $manufacturer = Manufacturer::findOrFail($this->aggregateUuid);

        $manufacturer->delete();
    }
}
