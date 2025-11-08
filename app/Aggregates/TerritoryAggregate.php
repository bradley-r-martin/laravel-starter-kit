<?php

declare(strict_types=1);

namespace App\Aggregates;

use App\Events\Territory\TerritoryClosed;
use App\Events\Territory\TerritoryCreated;
use App\Events\Territory\TerritoryDestroyed;
use App\Events\Territory\TerritoryReopened;
use App\Events\Territory\TerritoryUpdated;
use DateTimeImmutable;
use Spatie\EventSourcing\AggregateRoots\AggregateRoot;

final class TerritoryAggregate extends AggregateRoot
{
    public ?string $operatorId = null;

    public ?string $merchantAccountId = null;

    public ?string $name = null;

    public ?DateTimeImmutable $closedAt = null;

    public ?string $closedReason = null;

    public ?DateTimeImmutable $destroyedAt = null;

    public ?string $destroyedReason = null;

    public function create(
        string $operatorId,
        ?string $merchantAccountId,
        string $name,
    ): self {
        $this->recordThat(new TerritoryCreated(
            operatorId: $operatorId,
            merchantAccountId: $merchantAccountId,
            name: $name,
        ));

        return $this;
    }

    public function update(
        ?string $operatorId = null,
        bool $merchantAccountIdTouched = false,
        ?string $merchantAccountId = null,
        ?string $name = null,
    ): self {
        $this->recordThat(new TerritoryUpdated(
            operatorId: $operatorId,
            merchantAccountIdTouched: $merchantAccountIdTouched,
            merchantAccountId: $merchantAccountId,
            name: $name,
        ));

        return $this;
    }

    public function close(
        string $reason,
    ): self {
        $this->recordThat(new TerritoryClosed(
            reason: $reason,
        ));

        return $this;
    }

    public function reopen(
        string $reason,
    ): self {
        $this->recordThat(new TerritoryReopened(
            reason: $reason,
        ));

        return $this;
    }

    public function destroy(
        string $reason,
    ): self {
        $this->recordThat(new TerritoryDestroyed(
            reason: $reason,
        ));

        return $this;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyTerritoryCreated(TerritoryCreated $event): void
    {
        $this->operatorId = $event->operatorId;
        $this->merchantAccountId = $event->merchantAccountId;
        $this->name = $event->name;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyTerritoryUpdated(TerritoryUpdated $event): void
    {
        if ($event->operatorId !== null) {
            $this->operatorId = $event->operatorId;
        }

        if ($event->merchantAccountIdTouched) {
            $this->merchantAccountId = $event->merchantAccountId;
        }

        if ($event->name !== null) {
            $this->name = $event->name;
        }
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyTerritoryClosed(TerritoryClosed $event): void
    {
        $this->closedAt = new DateTimeImmutable();
        $this->closedReason = $event->reason;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyTerritoryReopened(): void
    {
        $this->closedAt = null;
        $this->closedReason = null;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyTerritoryDestroyed(TerritoryDestroyed $event): void
    {
        $this->destroyedAt = new DateTimeImmutable();
        $this->destroyedReason = $event->reason;
    }
}
