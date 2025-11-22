<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Manufacturer;
use App\Models\Product;
use App\Models\ProductType;

final class ProductActions
{
    public Product $product;

    public function __construct(
        Product|string $product,
    ) {
        if (is_string($product)) {
            /** @var Product $product */
            $product = Product::findOrFail($product);
        }
        $this->product = $product;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public static function create(array $data): Product
    {
        // Add denormalized fields
        if (isset($data['product_type_id'])) {
            /** @var ProductType $productType */
            $productType = ProductType::findOrFail($data['product_type_id']);
            $data['__product_type_name'] = $productType->name;
        }

        if (isset($data['manufacturer_id'])) {
            /** @var Manufacturer $manufacturer */
            $manufacturer = Manufacturer::findOrFail($data['manufacturer_id']);
            $data['__manufacturer_name'] = $manufacturer->name;
        }

        $product = Product::create($data);

        // Update counters
        if (isset($data['product_type_id'])) {
            ProductType::whereKey($data['product_type_id'])->increment('__products_count');
        }

        if (isset($data['manufacturer_id'])) {
            Manufacturer::whereKey($data['manufacturer_id'])->increment('__products_count');
        }

        return $product;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(array $data): Product
    {
        /** @var string|null $oldProductTypeId */
        $oldProductTypeId = $this->product->product_type_id;
        /** @var string|null $oldManufacturerId */
        $oldManufacturerId = $this->product->manufacturer_id;

        // Handle product type change
        if (array_key_exists('product_type_id', $data)) {
            $newProductTypeId = $data['product_type_id'];

            if ($newProductTypeId !== null) {
                // Update denormalized name
                /** @var ProductType $productType */
                $productType = ProductType::findOrFail($newProductTypeId);
                $data['__product_type_name'] = $productType->name;

                // Update counts if product type changed
                if ($oldProductTypeId !== null && $oldProductTypeId !== $newProductTypeId) {
                    ProductType::whereKey($oldProductTypeId)->decrement('__products_count');
                    ProductType::whereKey($newProductTypeId)->increment('__products_count');
                } elseif ($oldProductTypeId === null) {
                    ProductType::whereKey($newProductTypeId)->increment('__products_count');
                }
            } else {
                // Clearing product type
                $data['__product_type_name'] = null;
                if ($oldProductTypeId !== null) {
                    ProductType::whereKey($oldProductTypeId)->decrement('__products_count');
                }
            }
        }

        // Handle manufacturer change
        if (array_key_exists('manufacturer_id', $data)) {
            $newManufacturerId = $data['manufacturer_id'];

            if ($newManufacturerId !== null) {
                // Update denormalized name
                /** @var Manufacturer $manufacturer */
                $manufacturer = Manufacturer::findOrFail($newManufacturerId);
                $data['__manufacturer_name'] = $manufacturer->name;

                // Update counts if manufacturer changed
                if ($oldManufacturerId !== null && $oldManufacturerId !== $newManufacturerId) {
                    Manufacturer::whereKey($oldManufacturerId)->decrement('__products_count');
                    Manufacturer::whereKey($newManufacturerId)->increment('__products_count');
                } elseif ($oldManufacturerId === null) {
                    Manufacturer::whereKey($newManufacturerId)->increment('__products_count');
                }
            } else {
                // Clearing manufacturer
                $data['__manufacturer_name'] = null;
                if ($oldManufacturerId !== null) {
                    Manufacturer::whereKey($oldManufacturerId)->decrement('__products_count');
                }
            }
        }

        $this->product->update($data);

        return $this->product;
    }

    public function close(): Product
    {
        $this->product->update([
            'closed_at' => now(),
        ]);

        return $this->product;
    }

    public function reinstate(): Product
    {
        $this->product->update([
            'closed_at' => null,
        ]);

        return $this->product;
    }

    public function destroy(): void
    {
        // Update counters before deletion
        /** @var string|null $productTypeId */
        $productTypeId = $this->product->product_type_id;
        if ($productTypeId !== null) {
            ProductType::whereKey($productTypeId)->decrement('__products_count');
        }

        /** @var string|null $manufacturerId */
        $manufacturerId = $this->product->manufacturer_id;
        if ($manufacturerId !== null) {
            Manufacturer::whereKey($manufacturerId)->decrement('__products_count');
        }

        $this->product->delete();
    }
}
