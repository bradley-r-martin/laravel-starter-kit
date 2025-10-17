<?php

declare(strict_types=1);

namespace App\Projectors;

use App\Events\Product\ProductClosed;
use App\Events\Product\ProductCreated;
use App\Events\Product\ProductDestroyed;
use App\Events\Product\ProductReinstated;
use App\Events\Product\ProductUpdated;
use App\Models\Manufacturer;
use App\Models\Product;
use App\Models\ProductType;
use Spatie\EventSourcing\EventHandlers\Projectors\Projector;
use Spatie\EventSourcing\StoredEvents\StoredEvent;

final class ProductProjector extends Projector
{
    private ?string $aggregateUuid = null;

    public function handle(StoredEvent $storedEvent): void
    {
        $this->aggregateUuid = $storedEvent->aggregate_uuid;

        parent::handle($storedEvent);
    }

    public function onProductCreated(ProductCreated $event): void
    {
        $productType = ProductType::findOrFail($event->productTypeId);
        $manufacturer = Manufacturer::findOrFail($event->manufacturerId);

        Product::create([
            'id' => $this->aggregateUuid,
            'product_type_id' => $event->productTypeId,
            'manufacturer_id' => $event->manufacturerId,
            'name' => $event->name,
            'sku' => $event->sku,
            'units' => $event->units,
            'cost' => $event->cost,
            'price' => $event->price,
            'rebate' => $event->rebate,
            'royalty' => $event->royalty,
            'avatar' => $event->avatar?->isValid() === true ? $event->avatar : null,
            '__product_type_name' => $productType->name,
            '__manufacturer_name' => $manufacturer->name,
        ]);
    }

    public function onProductUpdated(ProductUpdated $event): void
    {
        $product = Product::findOrFail($this->aggregateUuid);

        $updates = [];

        if ($event->productTypeId !== null) {
            $productType = ProductType::findOrFail($event->productTypeId);
            $updates['product_type_id'] = $event->productTypeId;
            $updates['__product_type_name'] = $productType->name;
        }

        if ($event->manufacturerId !== null) {
            $manufacturer = Manufacturer::findOrFail($event->manufacturerId);
            $updates['manufacturer_id'] = $event->manufacturerId;
            $updates['__manufacturer_name'] = $manufacturer->name;
        }

        if ($event->name !== null) {
            $updates['name'] = $event->name;
        }

        if ($event->sku !== null) {
            $updates['sku'] = $event->sku;
        }

        if ($event->units !== null) {
            $updates['units'] = $event->units;
        }

        if ($event->cost !== null) {
            $updates['cost'] = $event->cost;
        }

        if ($event->price !== null) {
            $updates['price'] = $event->price;
        }

        if ($event->rebate !== null) {
            $updates['rebate'] = $event->rebate;
        }

        if ($event->royalty !== null) {
            $updates['royalty'] = $event->royalty;
        }

        if ($event->avatar instanceof \App\Domain\File) {
            $updates['avatar'] = $event->avatar->isValid() ? $event->avatar : null;
        }

        if ($updates !== []) {
            $product->update($updates);
        }
    }

    public function onProductClosed(ProductClosed $event): void
    {
        $product = Product::findOrFail($this->aggregateUuid);

        $product->update([
            'closed_at' => now(),
        ]);
    }

    public function onProductReinstated(ProductReinstated $event): void
    {
        $product = Product::findOrFail($this->aggregateUuid);

        $product->update([
            'closed_at' => null,
        ]);
    }

    public function onProductDestroyed(ProductDestroyed $event): void
    {
        $product = Product::findOrFail($this->aggregateUuid);

        $product->delete();
    }
}
