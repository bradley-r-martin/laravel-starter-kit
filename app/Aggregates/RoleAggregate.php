<?php

declare(strict_types=1);

namespace App\Aggregates;

use App\Events\Role\RoleClosed;
use App\Events\Role\RoleCreated;
use App\Events\Role\RoleUpdated;
use DateTimeImmutable;
use Spatie\EventSourcing\AggregateRoots\AggregateRoot;

final class RoleAggregate extends AggregateRoot
{
    public ?string $name = null;

    public ?string $description = null;

    public bool $hidden = false;

    public ?DateTimeImmutable $closedAt = null;

    public ?string $closedReason = null;

    public function createRole(
        string $name,
        string $description,
        bool $hidden = false,
    ): self {
        $this->recordThat(new RoleCreated(
            name: $name,
            description: $description,
            hidden: $hidden,
        ));

        return $this;
    }

    public function updateRole(
        ?string $name = null,
        ?string $description = null,
        ?bool $hidden = null,
    ): self {
        $this->recordThat(new RoleUpdated(
            name: $name,
            description: $description,
            hidden: $hidden,
        ));

        return $this;
    }

    public function closeRole(string $reason = 'No reason provided'): self
    {
        $this->recordThat(new RoleClosed(reason: $reason));

        return $this;
    }
}
