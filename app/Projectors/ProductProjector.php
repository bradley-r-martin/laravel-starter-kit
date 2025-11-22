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

        // Update product type count
        $productType->increment('__products_count');

        // Update manufacturer count
        $manufacturer->increment('__products_count');
    }

    public function onProductUpdated(ProductUpdated $event): void
    {
        $product = Product::findOrFail($this->aggregateUuid);

        $updates = [];

        if ($event->hasChange('product_type_id')) {
            $newProductTypeId = $event->getProductTypeId();

            if ($newProductTypeId !== null) {
                // Update product type counts if the product type changed
                // @phpstan-ignore-next-line notIdentical.alwaysTrue
                if ($product->product_type_id !== null && $product->product_type_id !== $newProductTypeId) {
                    $oldProductType = ProductType::findOrFail($product->product_type_id);
                    $oldProductType->decrement('__products_count');
                }

                $newProductType = ProductType::findOrFail($newProductTypeId);

                if ($product->product_type_id !== $newProductTypeId) {
                    $newProductType->increment('__products_count');
                }

                $updates['product_type_id'] = $newProductTypeId;
                $updates['__product_type_name'] = $newProductType->name;
            } else {
                // If product_type_id is being cleared, decrement the old count
                // @phpstan-ignore-next-line notIdentical.alwaysTrue
                if ($product->product_type_id !== null) {
                    $oldProductType = ProductType::findOrFail($product->product_type_id);
                    $oldProductType->decrement('__products_count');
                }

                $updates['product_type_id'] = null;
                $updates['__product_type_name'] = null;
            }
        }

        if ($event->hasChange('manufacturer_id')) {
            $newManufacturerId = $event->getManufacturerId();

            if ($newManufacturerId !== null) {
                // Update manufacturer counts if the manufacturer changed
                // @phpstan-ignore-next-line notIdentical.alwaysTrue
                if ($product->manufacturer_id !== null && $product->manufacturer_id !== $newManufacturerId) {
                    $oldManufacturer = Manufacturer::findOrFail($product->manufacturer_id);
                    $oldManufacturer->decrement('__products_count');
                }

                $newManufacturer = Manufacturer::findOrFail($newManufacturerId);

                if ($product->manufacturer_id !== $newManufacturerId) {
                    $newManufacturer->increment('__products_count');
                }

                $updates['manufacturer_id'] = $newManufacturerId;
                $updates['__manufacturer_name'] = $newManufacturer->name;
            } else {
                // If manufacturer_id is being cleared, decrement the old count
                // @phpstan-ignore-next-line notIdentical.alwaysTrue
                if ($product->manufacturer_id !== null) {
                    $oldManufacturer = Manufacturer::findOrFail($product->manufacturer_id);
                    $oldManufacturer->decrement('__products_count');
                }

                $updates['manufacturer_id'] = null;
                $updates['__manufacturer_name'] = null;
            }
        }

        if ($event->hasChange('name')) {
            $updates['name'] = $event->getName();
        }

        if ($event->hasChange('sku')) {
            $updates['sku'] = $event->getSku();
        }

        if ($event->hasChange('units')) {
            $updates['units'] = $event->getUnits();
        }

        if ($event->hasChange('cost')) {
            $updates['cost'] = $event->getCost();
        }

        if ($event->hasChange('price')) {
            $updates['price'] = $event->getPrice();
        }

        if ($event->hasChange('rebate')) {
            $updates['rebate'] = $event->getRebate();
        }

        if ($event->hasChange('royalty')) {
            $updates['royalty'] = $event->getRoyalty();
        }

        if ($event->hasChange('avatar')) {
            $avatar = $event->getAvatar();
            $updates['avatar'] = ($avatar instanceof \App\Domain\File && $avatar->isValid()) ? $avatar : null;
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

        // Update product type count
        $productType = ProductType::findOrFail($product->product_type_id);
        $productType->decrement('__products_count');

        // Update manufacturer count
        $manufacturer = Manufacturer::findOrFail($product->manufacturer_id);
        $manufacturer->decrement('__products_count');

        $product->delete();
    }
}
