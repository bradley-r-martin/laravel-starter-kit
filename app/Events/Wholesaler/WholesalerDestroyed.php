<?php

declare(strict_types=1);

namespace App\Events\Wholesaler;

use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class WholesalerDestroyed extends ShouldBeStored
{
    public function __construct(
        public string $reason,
    ) {}
}
