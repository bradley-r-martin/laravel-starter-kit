<?php

declare(strict_types=1);

namespace App\Aggregates;

use App\Events\Wholesaler\WholesalerClosed;
use App\Events\Wholesaler\WholesalerCreated;
use App\Events\Wholesaler\WholesalerDestroyed;
use App\Events\Wholesaler\WholesalerReopened;
use App\Events\Wholesaler\WholesalerUpdated;
use DateTimeImmutable;
use Spatie\EventSourcing\AggregateRoots\AggregateRoot;

final class WholesalerAggregate extends AggregateRoot
{
    public ?string $name = null;

    public ?DateTimeImmutable $closedAt = null;

    public ?string $closedReason = null;

    public ?DateTimeImmutable $destroyedAt = null;

    public ?string $destroyedReason = null;

    public function create(
        string $name,
    ): self {
        $this->recordThat(new WholesalerCreated(
            name: $name,
        ));

        return $this;
    }

    public function update(
        ?string $name = null,
    ): self {
        $this->recordThat(new WholesalerUpdated(
            name: $name,
        ));

        return $this;
    }

    public function close(
        string $reason,
    ): self {
        $this->recordThat(new WholesalerClosed(
            reason: $reason,
        ));

        return $this;
    }

    public function reopen(
        string $reason,
    ): self {
        $this->recordThat(new WholesalerReopened(
            reason: $reason,
        ));

        return $this;
    }

    public function destroy(
        string $reason,
    ): self {
        $this->recordThat(new WholesalerDestroyed(
            reason: $reason,
        ));

        return $this;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyWholesalerCreated(WholesalerCreated $event): void
    {
        $this->name = $event->name;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyWholesalerUpdated(WholesalerUpdated $event): void
    {
        if ($event->name !== null) {
            $this->name = $event->name;
        }
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyWholesalerClosed(WholesalerClosed $event): void
    {
        $this->closedAt = new DateTimeImmutable();
        $this->closedReason = $event->reason;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyWholesalerReopened(): void
    {
        $this->closedAt = null;
        $this->closedReason = null;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyWholesalerDestroyed(WholesalerDestroyed $event): void
    {
        $this->destroyedAt = new DateTimeImmutable();
        $this->destroyedReason = $event->reason;
    }
}
