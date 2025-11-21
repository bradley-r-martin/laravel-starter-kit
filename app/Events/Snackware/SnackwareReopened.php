<?php

declare(strict_types=1);

namespace App\Events\Snackware;

use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class SnackwareReopened extends ShouldBeStored
{
    public function __construct(
        public string $reason,
    ) {}
}

