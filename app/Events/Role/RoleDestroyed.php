<?php

declare(strict_types=1);

namespace App\Events\Role;

use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class RoleDestroyed extends ShouldBeStored
{
    public function __construct() {}
}
