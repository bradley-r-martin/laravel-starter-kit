<?php

declare(strict_types=1);

namespace App\Events\User;

use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class UserUnsuspended extends ShouldBeStored
{
    public function __construct(
        public string $reason,
        public bool $notify = false,
    ) {}
}
