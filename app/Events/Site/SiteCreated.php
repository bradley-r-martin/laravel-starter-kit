<?php

declare(strict_types=1);

namespace App\Events\Site;

use App\Domain\Address;
use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class SiteCreated extends ShouldBeStored
{
    public function __construct(
        public string $territoryId,
        public string $operatorId,
        public ?string $routeId,
        public int $order,
        public string $name,
        public ?Address $address = null,
        public ?array $openingHours = null,
        public ?string $managerCode = null,
    ) {}
}

