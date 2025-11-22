<?php

declare(strict_types=1);

namespace App\Aggregates;

use App\Events\Snackware\SnackwareClosed;
use App\Events\Snackware\SnackwareCreated;
use App\Events\Snackware\SnackwareDestroyed;
use App\Events\Snackware\SnackwareReopened;
use App\Events\Snackware\SnackwareUpdated;
use DateTimeImmutable;
use Spatie\EventSourcing\AggregateRoots\AggregateRoot;

final class SnackwareAggregate extends AggregateRoot
{
    public ?string $territoryId = null;

    public ?string $operatorId = null;

    public ?string $name = null;

    public ?string $type = null;

    public ?string $icon = null;

    public ?int $price = null;

    public ?DateTimeImmutable $closedAt = null;

    public ?string $closedReason = null;

    public function create(
        string $territoryId,
        string $operatorId,
        string $name,
        string $type = 'box',
        ?string $icon = null,
        int $price = 0,
    ): self {
        $this->recordThat(new SnackwareCreated(
            territoryId: $territoryId,
            operatorId: $operatorId,
            name: $name,
            type: $type,
            icon: $icon,
            price: $price,
        ));

        return $this;
    }

    public function update(
        ?string $name = null,
        ?string $type = null,
        ?string $icon = null,
        ?int $price = null,
    ): self {
        $this->recordThat(new SnackwareUpdated(
            name: $name,
            type: $type,
            icon: $icon,
            price: $price,
        ));

        return $this;
    }

    public function close(string $reason): self
    {
        $this->recordThat(new SnackwareClosed(reason: $reason));

        return $this;
    }

    public function reopen(string $reason): self
    {
        $this->recordThat(new SnackwareReopened(reason: $reason));

        return $this;
    }

    public function destroy(string $reason): self
    {
        $this->recordThat(new SnackwareDestroyed(reason: $reason));

        return $this;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applySnackwareCreated(SnackwareCreated $event): void
    {
        $this->territoryId = $event->territoryId;
        $this->operatorId = $event->operatorId;
        $this->name = $event->name;
        $this->type = $event->type;
        $this->icon = $event->icon;
        $this->price = $event->price;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applySnackwareUpdated(SnackwareUpdated $event): void
    {
        if ($event->name !== null) {
            $this->name = $event->name;
        }
        if ($event->type !== null) {
            $this->type = $event->type;
        }
        if ($event->icon !== null) {
            $this->icon = $event->icon;
        }
        if ($event->price !== null) {
            $this->price = $event->price;
        }
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applySnackwareClosed(SnackwareClosed $event): void
    {
        $this->closedAt = new DateTimeImmutable();
        $this->closedReason = $event->reason;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applySnackwareReopened(): void
    {
        $this->closedAt = null;
        $this->closedReason = null;
    }
}
