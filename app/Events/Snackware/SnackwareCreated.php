<?php

declare(strict_types=1);

namespace App\Events\Snackware;

use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class SnackwareCreated extends ShouldBeStored
{
    public function __construct(
        public string $territoryId,
        public string $operatorId,
        public string $name,
        public string $type,
        public ?string $icon = null,
        public int $price = 0,
    ) {}
}
