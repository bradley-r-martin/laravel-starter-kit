<?php

declare(strict_types=1);

namespace App\Aggregates;

use App\Events\Manufacturer\ManufacturerClosed;
use App\Events\Manufacturer\ManufacturerCreated;
use App\Events\Manufacturer\ManufacturerDestroyed;
use App\Events\Manufacturer\ManufacturerReopened;
use App\Events\Manufacturer\ManufacturerUpdated;
use DateTimeImmutable;
use Spatie\EventSourcing\AggregateRoots\AggregateRoot;

final class ManufacturerAggregate extends AggregateRoot
{
    public ?string $name = null;

    public ?DateTimeImmutable $closedAt = null;

    public ?string $closedReason = null;

    public ?DateTimeImmutable $destroyedAt = null;

    public ?string $destroyedReason = null;

    public function create(
        string $name,
    ): self {
        $this->recordThat(new ManufacturerCreated(
            name: $name,
        ));

        return $this;
    }

    public function update(
        ?string $name = null,
    ): self {
        $this->recordThat(new ManufacturerUpdated(
            name: $name,
        ));

        return $this;
    }

    public function close(
        string $reason,
    ): self {
        $this->recordThat(new ManufacturerClosed(
            reason: $reason,
        ));

        return $this;
    }

    public function reopen(
        string $reason,
    ): self {
        $this->recordThat(new ManufacturerReopened(
            reason: $reason,
        ));

        return $this;
    }

    public function destroy(
        string $reason,
    ): self {
        $this->recordThat(new ManufacturerDestroyed(
            reason: $reason,
        ));

        return $this;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyManufacturerCreated(ManufacturerCreated $event): void
    {
        $this->name = $event->name;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyManufacturerUpdated(ManufacturerUpdated $event): void
    {
        if ($event->name !== null) {
            $this->name = $event->name;
        }
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyManufacturerClosed(ManufacturerClosed $event): void
    {
        $this->closedAt = new DateTimeImmutable();
        $this->closedReason = $event->reason;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyManufacturerReopened(): void
    {
        $this->closedAt = null;
        $this->closedReason = null;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyManufacturerDestroyed(ManufacturerDestroyed $event): void
    {
        $this->destroyedAt = new DateTimeImmutable();
        $this->destroyedReason = $event->reason;
    }
}
