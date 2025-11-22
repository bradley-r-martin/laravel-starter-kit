<?php

declare(strict_types=1);

namespace App\Events\Product;

use App\Domain\File;
use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class ProductUpdated extends ShouldBeStored
{
    /**
     * @param  array{product_type_id?: string|null, manufacturer_id?: string|null, name?: string|null, sku?: string|null, units?: int|null, cost?: int|null, price?: int|null, rebate?: float|null, royalty?: float|null, avatar?: File|null}  $changes
     */
    public function __construct(
        public array $changes,
    ) {}

    public function getProductTypeId(): ?string
    {
        return $this->changes['product_type_id'] ?? null;
    }

    public function getManufacturerId(): ?string
    {
        return $this->changes['manufacturer_id'] ?? null;
    }

    public function getName(): ?string
    {
        return $this->changes['name'] ?? null;
    }

    public function getSku(): ?string
    {
        return $this->changes['sku'] ?? null;
    }

    public function getUnits(): ?int
    {
        return $this->changes['units'] ?? null;
    }

    public function getCost(): ?int
    {
        return $this->changes['cost'] ?? null;
    }

    public function getPrice(): ?int
    {
        return $this->changes['price'] ?? null;
    }

    public function getRebate(): ?float
    {
        return $this->changes['rebate'] ?? null;
    }

    public function getRoyalty(): ?float
    {
        return $this->changes['royalty'] ?? null;
    }

    public function getAvatar(): ?File
    {
        return $this->changes['avatar'] ?? null;
    }

    public function hasChange(string $field): bool
    {
        return array_key_exists($field, $this->changes);
    }
}
