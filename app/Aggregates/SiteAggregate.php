<?php

declare(strict_types=1);

namespace App\Aggregates;

use App\Domain\Address;
use App\Events\Site\SiteCreated;
use Spatie\EventSourcing\AggregateRoots\AggregateRoot;

final class SiteAggregate extends AggregateRoot
{
    public ?string $territoryId = null;

    public ?string $operatorId = null;

    public ?string $routeId = null;

    public ?int $order = null;

    public ?string $name = null;

    public ?Address $address = null;

    public ?array $openingHours = null;

    public ?string $managerCode = null;

    public function create(
        string $territoryId,
        string $operatorId,
        ?string $routeId,
        int $order,
        string $name,
        ?Address $address = null,
        ?array $openingHours = null,
        ?string $managerCode = null,
    ): self {
        $this->recordThat(new SiteCreated(
            territoryId: $territoryId,
            operatorId: $operatorId,
            routeId: $routeId,
            order: $order,
            name: $name,
            address: $address,
            openingHours: $openingHours,
            managerCode: $managerCode,
        ));

        return $this;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applySiteCreated(SiteCreated $event): void
    {
        $this->territoryId = $event->territoryId;
        $this->operatorId = $event->operatorId;
        $this->routeId = $event->routeId;
        $this->order = $event->order;
        $this->name = $event->name;
        $this->address = $event->address;
        $this->openingHours = $event->openingHours;
        $this->managerCode = $event->managerCode;
    }
}

