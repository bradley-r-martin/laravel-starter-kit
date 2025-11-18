<?php

declare(strict_types=1);

namespace App\Events\Site;

use App\Domain\Address;
use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class SiteUpdated extends ShouldBeStored
{
    public function __construct(
        public ?string $name = null,
        public ?Address $address = null,
        /** @var array<int|string, mixed>|null */
        public ?array $openingHours = null,
    ) {}
}
