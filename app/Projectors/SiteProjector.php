<?php

declare(strict_types=1);

namespace App\Projectors;

use App\Events\Site\SiteClosed;
use App\Events\Site\SiteCreated;
use App\Events\Site\SiteManagerCodeRefreshed;
use App\Events\Site\SiteReopened;
use App\Events\Site\SiteUpdated;
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

    public function onSiteUpdated(SiteUpdated $event): void
    {
        $site = Site::findOrFail($this->aggregateUuid);

        $updateData = [];

        if ($event->name !== null) {
            $updateData['name'] = $event->name;
        }

        if ($event->address instanceof \App\Domain\Address) {
            $updateData['address'] = $event->address->toArray();
        }

        if ($event->openingHours !== null) {
            $updateData['opening_hours'] = $event->openingHours;
        }

        if ($updateData !== []) {
            $site->update($updateData);
        }
    }

    public function onSiteClosed(SiteClosed $event): void
    {
        $site = Site::findOrFail($this->aggregateUuid);

        $site->update([
            'closed_at' => now(),
        ]);
    }

    public function onSiteReopened(SiteReopened $event): void
    {
        $site = Site::findOrFail($this->aggregateUuid);

        $site->update([
            'closed_at' => null,
        ]);
    }

    public function onSiteManagerCodeRefreshed(SiteManagerCodeRefreshed $event): void
    {
        $site = Site::findOrFail($this->aggregateUuid);

        $site->update([
            'manager_code' => $event->managerCode,
        ]);
    }
}
