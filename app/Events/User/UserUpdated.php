<?php

declare(strict_types=1);

namespace App\Events\User;

use App\Domain\File;
use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class UserUpdated extends ShouldBeStored
{
    public function __construct(
        public ?string $firstName = null,
        public ?string $lastName = null,
        public ?string $email = null,
        public ?File $avatar = null,
    ) {}
}
