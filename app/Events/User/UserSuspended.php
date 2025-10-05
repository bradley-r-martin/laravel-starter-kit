<?php

declare(strict_types=1);

namespace App\Events\User;

use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class UserSuspended extends ShouldBeStored
{
    public function __construct(
        public string $reason,
        public bool $notify = false,
    ) {}
}
