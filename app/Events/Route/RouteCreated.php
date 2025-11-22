<?php

declare(strict_types=1);

namespace App\Events\Route;

use App\Domain\Schedule;
use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class RouteCreated extends ShouldBeStored
{
    public function __construct(
        public string $territoryId,
        public string $operatorId,
        public string $name,
        public ?Schedule $schedule = null,
    ) {}
}
