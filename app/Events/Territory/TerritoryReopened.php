<?php

declare(strict_types=1);

namespace App\Events\Territory;

use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class TerritoryReopened extends ShouldBeStored
{
    public function __construct(
        public string $reason,
    ) {}
}
