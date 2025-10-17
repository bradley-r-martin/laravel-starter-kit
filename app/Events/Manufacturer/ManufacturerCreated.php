<?php

declare(strict_types=1);

namespace App\Events\Manufacturer;

use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class ManufacturerCreated extends ShouldBeStored
{
    public function __construct(
        public string $name,
    ) {}
}
