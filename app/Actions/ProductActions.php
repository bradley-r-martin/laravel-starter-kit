<?php

declare(strict_types=1);

namespace App\Actions;

use App\Domain\File;
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
            $product = Product::findOrFail($product);
        }
        $this->product = $product;
    }

    public static function create(array $data): Product
    {

        // Handle product type
        if (array_key_exists('product_type_id', $data)) {
            $data['__product_type_name'] = ProductType::find($data['product_type_id'])?->name;

            // Derived data column updates
            ProductType::whereKey($data['product_type_id'])->increment('__products_count');
        }

        // Handle manufacturer
        if (array_key_exists('manufacturer_id', $data)) {
            $data['__manufacturer_name'] = Manufacturer::find($data['manufacturer_id'])?->name;

            // Derived data column updates
            Manufacturer::whereKey($data['manufacturer_id'])->increment('__products_count');
        }

        // Handle avatar
        if (array_key_exists('avatar', $data)) {
            $data['avatar'] = File::fromArray($data['avatar'])->persist();
        }

        return Product::create($data);
    }

    public function update(array $data): Product
    {
        // Handle product type change
        if (array_key_exists('product_type_id', $data)) {
            $data['__product_type_name'] = ProductType::find($data['product_type_id'])?->name;

            // Derived data column updates
            ProductType::whereKey($this->product->product_type_id)->decrement('__products_count');
            ProductType::whereKey($data['product_type_id'])->increment('__products_count');
        }

        // Handle manufacturer change
        if (array_key_exists('manufacturer_id', $data)) {
            $data['__manufacturer_name'] = Manufacturer::find($data['manufacturer_id'])?->name;

            // Derived data column updates
            Manufacturer::whereKey($this->product->manufacturer_id)->decrement('__products_count');
            Manufacturer::whereKey($data['manufacturer_id'])->increment('__products_count');
        }

        // Handle avatar
        if (array_key_exists('avatar', $data)) {
            if ($this->product->avatar) {
                $this->product->avatar->delete();
            }
            if ($data['avatar'] !== null) {

                $data['avatar'] = File::fromArray($data['avatar'])->persist();
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

        // Derived data column updates
        Manufacturer::whereKey($this->product->manufacturer_id)->decrement('__products_count');
        ProductType::whereKey($this->product->product_type_id)->decrement('__products_count');

        return $this->product;
    }

    public function reinstate(): Product
    {
        $this->product->update([
            'closed_at' => null,
        ]);

        // Derived data column updates
        Manufacturer::whereKey($this->product->manufacturer_id)->increment('__products_count');
        ProductType::whereKey($this->product->product_type_id)->increment('__products_count');

        return $this->product;
    }

    public function destroy(): void
    {
        $this->product->delete();
    }
}
