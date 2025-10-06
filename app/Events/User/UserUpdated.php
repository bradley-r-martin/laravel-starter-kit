<?php

declare(strict_types=1);

namespace App\Events\User;

use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class UserUpdated extends ShouldBeStored
{
    public function __construct(
        public string $firstName,
        public string $lastName,
        public string $email,
    ) {}
}
