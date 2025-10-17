<?php

declare(strict_types=1);

namespace App\Events\Product;

use App\Domain\File;
use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class ProductCreated extends ShouldBeStored
{
    public function __construct(
        public string $productTypeId,
        public string $manufacturerId,
        public string $name,
        public string $sku,
        public int $units,
        public int $cost,
        public int $price,
        public string $rebate,
        public string $royalty,
        public ?File $avatar = null,
    ) {}
}
