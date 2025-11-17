<?php

declare(strict_types=1);

namespace App\Events\Route;

use App\Domain\Schedule;
use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class RouteUpdated extends ShouldBeStored
{
    public function __construct(
        public ?string $name = null,
        public ?Schedule $schedule = null,
    ) {}
}
