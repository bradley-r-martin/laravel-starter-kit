<?php

declare(strict_types=1);

namespace App\Aggregates;

use App\Domain\Address;
use App\Events\Site\SiteClosed;
use App\Events\Site\SiteCreated;
use App\Events\Site\SiteManagerCodeRefreshed;
use App\Events\Site\SiteReopened;
use App\Events\Site\SiteRouteChanged;
use App\Events\Site\SiteUpdated;
use DateTimeImmutable;
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

    public ?DateTimeImmutable $closedAt = null;

    public ?string $closedReason = null;

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

    public function update(
        ?string $name = null,
        ?Address $address = null,
        ?array $openingHours = null,
    ): self {
        $this->recordThat(new SiteUpdated(
            name: $name,
            address: $address,
            openingHours: $openingHours,
        ));

        return $this;
    }

    public function close(string $reason): self
    {
        $this->recordThat(new SiteClosed(reason: $reason));

        return $this;
    }

    public function reopen(string $reason): self
    {
        $this->recordThat(new SiteReopened(reason: $reason));

        return $this;
    }

    public function refreshManagerCode(): self
    {
        $managerCode = mb_str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);

        $this->recordThat(new SiteManagerCodeRefreshed(managerCode: $managerCode));

        return $this;
    }

    public function changeRoute(?string $routeId): self
    {
        $this->recordThat(new SiteRouteChanged(routeId: $routeId));

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

    /**
     * @phpstan-ignore-next-line
     */
    private function applySiteUpdated(SiteUpdated $event): void
    {
        if ($event->name !== null) {
            $this->name = $event->name;
        }
        if ($event->address instanceof Address) {
            $this->address = $event->address;
        }
        if ($event->openingHours !== null) {
            $this->openingHours = $event->openingHours;
        }
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applySiteClosed(SiteClosed $event): void
    {
        $this->closedAt = new DateTimeImmutable();
        $this->closedReason = $event->reason;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applySiteReopened(): void
    {
        $this->closedAt = null;
        $this->closedReason = null;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applySiteManagerCodeRefreshed(SiteManagerCodeRefreshed $event): void
    {
        $this->managerCode = $event->managerCode;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applySiteRouteChanged(SiteRouteChanged $event): void
    {
        $this->routeId = $event->routeId;
    }
}
