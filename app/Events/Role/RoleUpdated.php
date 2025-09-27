<?php

declare(strict_types=1);

namespace App\Events\Role;

use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class RoleUpdated extends ShouldBeStored
{
    public function __construct(
        public ?string $name = null,
        public ?string $description = null,
        public ?bool $hidden = null,
    ) {}
}
