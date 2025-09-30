<?php

declare(strict_types=1);

namespace App\Events\Policy;

use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class PolicyDeprecated extends ShouldBeStored
{
    public function __construct(
        public string $policy,
        public string $ability
    ) {}
}
