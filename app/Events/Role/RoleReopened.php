<?php

declare(strict_types=1);

namespace App\Events\Role;

use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class RoleReopened extends ShouldBeStored
{
    public function __construct(
        public string $reason = 'No reason provided',
    ) {}
}
