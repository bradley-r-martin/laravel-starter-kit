<?php

declare(strict_types=1);

namespace App\Events\Role;

use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class RoleCreated extends ShouldBeStored
{
    public function __construct(
        public string $name,
        public string $description,
        public bool $hidden = false,
    ) {}
}
