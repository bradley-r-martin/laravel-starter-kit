<?php

declare(strict_types=1);

namespace App\Events\ProductType;

use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class ProductTypeReopened extends ShouldBeStored
{
    public function __construct(
        public string $reason,
    ) {}
}
