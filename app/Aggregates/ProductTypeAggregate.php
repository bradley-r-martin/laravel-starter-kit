<?php

declare(strict_types=1);

namespace App\Aggregates;

use App\Events\ProductType\ProductTypeClosed;
use App\Events\ProductType\ProductTypeCreated;
use App\Events\ProductType\ProductTypeDestroyed;
use App\Events\ProductType\ProductTypeReopened;
use App\Events\ProductType\ProductTypeUpdated;
use DateTimeImmutable;
use Spatie\EventSourcing\AggregateRoots\AggregateRoot;

final class ProductTypeAggregate extends AggregateRoot
{
    public ?string $name = null;

    public ?DateTimeImmutable $closedAt = null;

    public ?string $closedReason = null;

    public ?DateTimeImmutable $destroyedAt = null;

    public ?string $destroyedReason = null;

    public function create(
        string $name,
    ): self {
        $this->recordThat(new ProductTypeCreated(
            name: $name,
        ));

        return $this;
    }

    public function update(
        ?string $name = null,
    ): self {
        $this->recordThat(new ProductTypeUpdated(
            name: $name,
        ));

        return $this;
    }

    public function close(
        string $reason,
    ): self {
        $this->recordThat(new ProductTypeClosed(
            reason: $reason,
        ));

        return $this;
    }

    public function reopen(
        string $reason,
    ): self {
        $this->recordThat(new ProductTypeReopened(
            reason: $reason,
        ));

        return $this;
    }

    public function destroy(
        string $reason,
    ): self {
        $this->recordThat(new ProductTypeDestroyed(
            reason: $reason,
        ));

        return $this;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyProductTypeCreated(ProductTypeCreated $event): void
    {
        $this->name = $event->name;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyProductTypeUpdated(ProductTypeUpdated $event): void
    {
        if ($event->name !== null) {
            $this->name = $event->name;
        }
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyProductTypeClosed(ProductTypeClosed $event): void
    {
        $this->closedAt = new DateTimeImmutable();
        $this->closedReason = $event->reason;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyProductTypeReopened(): void
    {
        $this->closedAt = null;
        $this->closedReason = null;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyProductTypeDestroyed(ProductTypeDestroyed $event): void
    {
        $this->destroyedAt = new DateTimeImmutable();
        $this->destroyedReason = $event->reason;
    }
}
