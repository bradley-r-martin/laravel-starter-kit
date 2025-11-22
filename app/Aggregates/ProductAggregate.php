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
        $event = new ProductCreated(
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
        );

        $this->recordThat($event);

        // Manually apply the event to update aggregate state
        $this->applyProductCreated($event);

        return $this;
    }

    /**
     * @param  array{product_type_id?: string|null, manufacturer_id?: string|null, name?: string|null, sku?: string|null, units?: int|null, cost?: int|null, price?: int|null, rebate?: float|null, royalty?: float|null, avatar?: File|null}  $data
     */
    public function update(array $data): self
    {
        // Note: recordThat() automatically calls apply(), so the aggregate state
        // should already reflect all previously recorded events.

        // Filter to only include fields that are present in the input and have changed
        $changes = [];

        if (array_key_exists('product_type_id', $data)) {
            $newValue = $data['product_type_id'];
            if ($this->productTypeId !== $newValue) {
                $changes['product_type_id'] = $newValue;
            }
        }

        if (array_key_exists('manufacturer_id', $data)) {
            $newValue = $data['manufacturer_id'];
            if ($this->manufacturerId !== $newValue) {
                $changes['manufacturer_id'] = $newValue;
            }
        }

        if (array_key_exists('name', $data)) {
            $newValue = $data['name'];
            if ($this->name !== $newValue) {
                $changes['name'] = $newValue;
            }
        }

        if (array_key_exists('sku', $data)) {
            $newValue = $data['sku'];
            if ($this->sku !== $newValue) {
                $changes['sku'] = $newValue;
            }
        }

        if (array_key_exists('units', $data)) {
            $newValue = $data['units'];
            if ($this->units !== $newValue) {
                $changes['units'] = $newValue;
            }
        }

        if (array_key_exists('cost', $data)) {
            $newValue = $data['cost'];
            if ($this->cost !== $newValue) {
                $changes['cost'] = $newValue;
            }
        }

        if (array_key_exists('price', $data)) {
            $newValue = $data['price'];
            if ($this->price !== $newValue) {
                $changes['price'] = $newValue;
            }
        }

        if (array_key_exists('rebate', $data)) {
            $newValue = $data['rebate'];
            if ($this->rebate !== $newValue) {
                $changes['rebate'] = $newValue;
            }
        }

        if (array_key_exists('royalty', $data)) {
            $newValue = $data['royalty'];
            if ($this->royalty !== $newValue) {
                $changes['royalty'] = $newValue;
            }
        }

        if (array_key_exists('avatar', $data)) {
            // For File objects, compare by their array representation or handle null
            $currentAvatar = $this->avatar?->toArray();
            $newAvatar = $data['avatar'] instanceof File ? $data['avatar']->toArray() : null;

            // Compare arrays for equality (deep comparison)
            $avatarChanged = false;
            if ($currentAvatar === null && $newAvatar !== null) {
                $avatarChanged = true;
            } elseif ($currentAvatar !== null && $newAvatar === null) {
                $avatarChanged = true;
            } elseif ($currentAvatar !== null && $newAvatar !== null) {
                // Compare the arrays - they're different if any key/value differs
                $avatarChanged = (
                    ($currentAvatar['path'] ?? null) !== ($newAvatar['path'] ?? null) ||
                    ($currentAvatar['disk'] ?? null) !== ($newAvatar['disk'] ?? null) ||
                    ($currentAvatar['mime_type'] ?? null) !== ($newAvatar['mime_type'] ?? null) ||
                    ($currentAvatar['size'] ?? null) !== ($newAvatar['size'] ?? null) ||
                    ($currentAvatar['filename'] ?? null) !== ($newAvatar['filename'] ?? null)
                );
            }

            if ($avatarChanged) {
                $changes['avatar'] = $data['avatar'];
            }
        }

        // Only record event if there are actual changes
        if ($changes !== []) {
            $event = new ProductUpdated(
                changes: $changes,
            );

            $this->recordThat($event);

            // Manually apply the event to update aggregate state
            $this->applyProductUpdated($event);
        }

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

    private function applyProductUpdated(ProductUpdated $event): void
    {
        // Only apply changes that are present in the changes array
        // This allows null values to clear fields when explicitly set
        if ($event->hasChange('product_type_id')) {
            $this->productTypeId = $event->getProductTypeId();
        }

        if ($event->hasChange('manufacturer_id')) {
            $this->manufacturerId = $event->getManufacturerId();
        }

        if ($event->hasChange('name')) {
            $this->name = $event->getName();
        }

        if ($event->hasChange('sku')) {
            $this->sku = $event->getSku();
        }

        if ($event->hasChange('units')) {
            $this->units = $event->getUnits();
        }

        if ($event->hasChange('cost')) {
            $this->cost = $event->getCost();
        }

        if ($event->hasChange('price')) {
            $this->price = $event->getPrice();
        }

        if ($event->hasChange('rebate')) {
            $this->rebate = $event->getRebate();
        }

        if ($event->hasChange('royalty')) {
            $this->royalty = $event->getRoyalty();
        }

        if ($event->hasChange('avatar')) {
            $this->avatar = $event->getAvatar();
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
