<?php

declare(strict_types=1);

namespace App\Events\Product;

use App\Domain\File;
use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class ProductUpdated extends ShouldBeStored
{
    public function __construct(
        public ?string $productTypeId = null,
        public ?string $manufacturerId = null,
        public ?string $name = null,
        public ?string $sku = null,
        public ?int $units = null,
        public ?int $cost = null,
        public ?int $price = null,
        public ?float $rebate = null,
        public ?float $royalty = null,
        public ?File $avatar = null,
    ) {}
}
