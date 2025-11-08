<?php

declare(strict_types=1);

namespace App\Events\Operator;

use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class OperatorUnsuspended extends ShouldBeStored
{
    public function __construct(
        public string $reason,
    ) {}
}
