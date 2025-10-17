<?php

declare(strict_types=1);

namespace App\Projectors;

use App\Events\Wholesaler\WholesalerClosed;
use App\Events\Wholesaler\WholesalerCreated;
use App\Events\Wholesaler\WholesalerDestroyed;
use App\Events\Wholesaler\WholesalerReopened;
use App\Events\Wholesaler\WholesalerUpdated;
use App\Models\Wholesaler;
use Spatie\EventSourcing\EventHandlers\Projectors\Projector;
use Spatie\EventSourcing\StoredEvents\StoredEvent;

final class WholesalerProjector extends Projector
{
    private ?string $aggregateUuid = null;

    public function handle(StoredEvent $storedEvent): void
    {
        $this->aggregateUuid = $storedEvent->aggregate_uuid;

        parent::handle($storedEvent);
    }

    public function onWholesalerCreated(WholesalerCreated $event): void
    {
        Wholesaler::create([
            'id' => $this->aggregateUuid,
            'name' => $event->name,
        ]);
    }

    public function onWholesalerUpdated(WholesalerUpdated $event): void
    {
        $wholesaler = Wholesaler::findOrFail($this->aggregateUuid);

        $updates = [];

        if ($event->name !== null) {
            $updates['name'] = $event->name;
        }

        if ($updates !== []) {
            $wholesaler->update($updates);
        }
    }

    public function onWholesalerClosed(WholesalerClosed $event): void
    {
        $wholesaler = Wholesaler::findOrFail($this->aggregateUuid);

        $wholesaler->update([
            'closed_at' => now(),
        ]);
    }

    public function onWholesalerReopened(WholesalerReopened $event): void
    {
        $wholesaler = Wholesaler::findOrFail($this->aggregateUuid);

        $wholesaler->update([
            'closed_at' => null,
        ]);
    }

    public function onWholesalerDestroyed(WholesalerDestroyed $event): void
    {
        $wholesaler = Wholesaler::findOrFail($this->aggregateUuid);

        $wholesaler->delete();
    }
}
