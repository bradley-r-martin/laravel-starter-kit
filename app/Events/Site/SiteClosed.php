<?php

declare(strict_types=1);

namespace App\Events\Site;

use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class SiteClosed extends ShouldBeStored
{
    public function __construct(
        public string $reason,
    ) {}
}

