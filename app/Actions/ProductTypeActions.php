<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\ProductType;

final class ProductTypeActions
{
    public ProductType $productType;

    public function __construct(
        ProductType|string $productType,
    ) {
        if (is_string($productType)) {
            /** @var ProductType $productType */
            $productType = ProductType::findOrFail($productType);
        }
        $this->productType = $productType;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public static function create(array $data): ProductType
    {
        return ProductType::create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(array $data): ProductType
    {
        $this->productType->update($data);

        return $this->productType;
    }

    public function close(): ProductType
    {
        $this->productType->update([
            'closed_at' => now(),
        ]);

        return $this->productType;
    }

    public function reopen(): ProductType
    {
        $this->productType->update([
            'closed_at' => null,
        ]);

        return $this->productType;
    }

    public function destroy(): void
    {
        $this->productType->delete();
    }
}
