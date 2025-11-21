<?php

declare(strict_types=1);

namespace App\Events\Territory;

use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class TerritoryCreated extends ShouldBeStored
{
    public function __construct(
        public string $operatorId,
        public ?string $merchantAccountId,
        public string $name,
    ) {}
}

