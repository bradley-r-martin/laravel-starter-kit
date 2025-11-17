<?php

declare(strict_types=1);

namespace App\Projectors;

use App\Events\Site\SiteCreated;
use App\Models\Site;
use Spatie\EventSourcing\EventHandlers\Projectors\Projector;
use Spatie\EventSourcing\StoredEvents\StoredEvent;

final class SiteProjector extends Projector
{
    private ?string $aggregateUuid = null;

    public function handle(StoredEvent $storedEvent): void
    {
        $this->aggregateUuid = $storedEvent->aggregate_uuid;

        parent::handle($storedEvent);
    }

    public function onSiteCreated(SiteCreated $event): void
    {
        Site::create([
            'id' => $this->aggregateUuid,
            'territory_id' => $event->territoryId,
            'operator_id' => $event->operatorId,
            'route_id' => $event->routeId,
            'order' => $event->order,
            'name' => $event->name,
            'address' => $event->address?->toArray(),
            'opening_hours' => $event->openingHours,
            'manager_code' => $event->managerCode,
        ]);
    }
}

