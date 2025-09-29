<?php

declare(strict_types=1);

namespace App\Events\Policy;

use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class PolicyCreated extends ShouldBeStored
{
    public function __construct(
        public string $namespace,
        public string $policy,
        public string $ability,
        public ?string $description = null,
        public bool $hidden = false,
    ) {}
}
