<?php

declare(strict_types=1);

namespace App\Projectors;

use App\Events\Route\RouteCreated;
use App\Events\Route\RouteUpdated;
use App\Models\Route;
use Spatie\EventSourcing\EventHandlers\Projectors\Projector;
use Spatie\EventSourcing\StoredEvents\StoredEvent;

final class RouteProjector extends Projector
{
    private ?string $aggregateUuid = null;

    public function handle(StoredEvent $storedEvent): void
    {
        $this->aggregateUuid = $storedEvent->aggregate_uuid;

        parent::handle($storedEvent);
    }

    public function onRouteCreated(RouteCreated $event): void
    {
        Route::create([
            'id' => $this->aggregateUuid,
            'territory_id' => $event->territoryId,
            'operator_id' => $event->operatorId,
            'name' => $event->name,
            'schedule' => $event->schedule?->__toString() ?? null,
        ]);
    }

    public function onRouteUpdated(RouteUpdated $event): void
    {
        $route = Route::findOrFail($this->aggregateUuid);

        $updateData = [];

        if ($event->name !== null) {
            $updateData['name'] = $event->name;
        }

        if ($event->schedule instanceof \App\Domain\Schedule) {
            $updateData['schedule'] = $event->schedule->__toString();
        }

        if ($updateData !== []) {
            $route->update($updateData);
        }
    }
}
