<?php

declare(strict_types=1);

namespace App\Events\Product;

use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class ProductClosed extends ShouldBeStored
{
    public function __construct(
        public string $reason,
    ) {}
}
