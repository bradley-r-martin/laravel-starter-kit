<?php

declare(strict_types=1);

namespace App\Events\Territory;

use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class TerritoryUpdated extends ShouldBeStored
{
    public function __construct(
        public ?string $operatorId = null,
        public bool $merchantAccountIdTouched = false,
        public ?string $merchantAccountId = null,
        public ?string $name = null,
    ) {}
}
