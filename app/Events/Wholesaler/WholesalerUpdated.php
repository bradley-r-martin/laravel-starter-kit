<?php

declare(strict_types=1);

namespace App\Events\Wholesaler;

use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class WholesalerUpdated extends ShouldBeStored
{
    public function __construct(
        public ?string $name = null,
    ) {}
}
