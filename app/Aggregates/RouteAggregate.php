<?php

declare(strict_types=1);

namespace App\Aggregates;

use App\Domain\Schedule;
use App\Events\Route\RouteCreated;
use App\Events\Route\RouteUpdated;
use Spatie\EventSourcing\AggregateRoots\AggregateRoot;

final class RouteAggregate extends AggregateRoot
{
    public ?string $territoryId = null;

    public ?string $operatorId = null;

    public ?string $name = null;

    public ?Schedule $schedule = null;

    public function create(
        string $territoryId,
        string $operatorId,
        string $name,
        ?Schedule $schedule = null,
    ): self {
        $this->recordThat(new RouteCreated(
            territoryId: $territoryId,
            operatorId: $operatorId,
            name: $name,
            schedule: $schedule,
        ));

        return $this;
    }

    public function update(
        ?string $name = null,
        ?Schedule $schedule = null,
    ): self {
        $this->recordThat(new RouteUpdated(
            name: $name,
            schedule: $schedule,
        ));

        return $this;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyRouteCreated(RouteCreated $event): void
    {
        $this->territoryId = $event->territoryId;
        $this->operatorId = $event->operatorId;
        $this->name = $event->name;
        $this->schedule = $event->schedule;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyRouteUpdated(RouteUpdated $event): void
    {
        if ($event->name !== null) {
            $this->name = $event->name;
        }
        if ($event->schedule instanceof Schedule) {
            $this->schedule = $event->schedule;
        }
    }
}
