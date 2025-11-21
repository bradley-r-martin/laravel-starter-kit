<?php

declare(strict_types=1);

namespace App\Events\Snackware;

use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class SnackwareUpdated extends ShouldBeStored
{
    public function __construct(
        public ?string $name = null,
        public ?string $type = null,
        public ?string $icon = null,
        public ?int $price = null,
    ) {}
}

