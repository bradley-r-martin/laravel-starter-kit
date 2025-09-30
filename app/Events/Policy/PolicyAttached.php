<?php

declare(strict_types=1);

namespace App\Events\Policy;

use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class PolicyAttached extends ShouldBeStored
{
    public function __construct(
        public string $policy,
        public string $ability,
        public string $description = '',
        public bool $hidden = false
    ) {}
}
