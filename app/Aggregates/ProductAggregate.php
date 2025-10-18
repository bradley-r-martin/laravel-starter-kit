<?php

declare(strict_types=1);

namespace App\Aggregates;

use App\Domain\File;
use App\Events\Product\ProductClosed;
use App\Events\Product\ProductCreated;
use App\Events\Product\ProductDestroyed;
use App\Events\Product\ProductReinstated;
use App\Events\Product\ProductUpdated;
use DateTimeImmutable;
use Spatie\EventSourcing\AggregateRoots\AggregateRoot;

final class ProductAggregate extends AggregateRoot
{
    public ?string $productTypeId = null;

    public ?string $manufacturerId = null;

    public ?string $name = null;

    public ?string $sku = null;

    public ?int $units = null;

    public ?int $cost = null;

    public ?int $price = null;

    public ?float $rebate = null;

    public ?float $royalty = null;

    public ?File $avatar = null;

    public ?DateTimeImmutable $closedAt = null;

    public ?string $closedReason = null;

    public ?DateTimeImmutable $destroyedAt = null;

    public ?string $destroyedReason = null;

    public function create(
        string $productTypeId,
        string $manufacturerId,
        string $name,
        string $sku,
        int $units,
        int $cost,
        int $price,
        float $rebate,
        float $royalty,
        ?File $avatar = null,
    ): self {
        $this->recordThat(new ProductCreated(
            productTypeId: $productTypeId,
            manufacturerId: $manufacturerId,
            name: $name,
            sku: $sku,
            units: $units,
            cost: $cost,
            price: $price,
            rebate: $rebate,
            royalty: $royalty,
            avatar: $avatar,
        ));

        return $this;
    }

    public function update(
        ?string $productTypeId = null,
        ?string $manufacturerId = null,
        ?string $name = null,
        ?string $sku = null,
        ?int $units = null,
        ?int $cost = null,
        ?int $price = null,
        ?float $rebate = null,
        ?float $royalty = null,
        ?File $avatar = null,
    ): self {
        $this->recordThat(new ProductUpdated(
            productTypeId: $productTypeId,
            manufacturerId: $manufacturerId,
            name: $name,
            sku: $sku,
            units: $units,
            cost: $cost,
            price: $price,
            rebate: $rebate,
            royalty: $royalty,
            avatar: $avatar,
        ));

        return $this;
    }

    public function close(
        string $reason,
    ): self {
        $this->recordThat(new ProductClosed(
            reason: $reason,
        ));

        return $this;
    }

    public function reinstate(
        string $reason,
    ): self {
        $this->recordThat(new ProductReinstated(
            reason: $reason,
        ));

        return $this;
    }

    public function destroy(
        string $reason,
    ): self {
        $this->recordThat(new ProductDestroyed(
            reason: $reason,
        ));

        return $this;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyProductCreated(ProductCreated $event): void
    {
        $this->productTypeId = $event->productTypeId;
        $this->manufacturerId = $event->manufacturerId;
        $this->name = $event->name;
        $this->sku = $event->sku;
        $this->units = $event->units;
        $this->cost = $event->cost;
        $this->price = $event->price;
        $this->rebate = $event->rebate;
        $this->royalty = $event->royalty;
        $this->avatar = $event->avatar;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyProductUpdated(ProductUpdated $event): void
    {
        if ($event->productTypeId !== null) {
            $this->productTypeId = $event->productTypeId;
        }

        if ($event->manufacturerId !== null) {
            $this->manufacturerId = $event->manufacturerId;
        }

        if ($event->name !== null) {
            $this->name = $event->name;
        }

        if ($event->sku !== null) {
            $this->sku = $event->sku;
        }

        if ($event->units !== null) {
            $this->units = $event->units;
        }

        if ($event->cost !== null) {
            $this->cost = $event->cost;
        }

        if ($event->price !== null) {
            $this->price = $event->price;
        }

        if ($event->rebate !== null) {
            $this->rebate = $event->rebate;
        }

        if ($event->royalty !== null) {
            $this->royalty = $event->royalty;
        }

        if ($event->avatar instanceof File) {
            $this->avatar = $event->avatar;
        }
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyProductClosed(ProductClosed $event): void
    {
        $this->closedAt = new DateTimeImmutable();
        $this->closedReason = $event->reason;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyProductReinstated(): void
    {
        $this->closedAt = null;
        $this->closedReason = null;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyProductDestroyed(ProductDestroyed $event): void
    {
        $this->destroyedAt = new DateTimeImmutable();
        $this->destroyedReason = $event->reason;
    }
}
