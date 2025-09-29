<?php

declare(strict_types=1);

namespace App\Events\Policy;

use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class PolicyUpdated extends ShouldBeStored
{
    public function __construct(
        public string $namespace,
        public ?string $policy = null,
        public ?string $ability = null,
        public ?string $description = null,
        public ?bool $hidden = null,
    ) {}
}
