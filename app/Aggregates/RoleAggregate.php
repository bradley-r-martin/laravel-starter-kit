<?php

declare(strict_types=1);

namespace App\Aggregates;

use App\Events\Policy\PolicyAttached;
use App\Events\Policy\PolicyDeprecated;
use App\Events\Policy\PolicyDetached;
use App\Events\Role\RoleClosed;
use App\Events\Role\RoleCreated;
use App\Events\Role\RoleDestroyed;
use App\Events\Role\RoleReopened;
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

    /**
     * @var array<int, string>
     */
    public array $policyNamespaces = [];

    /**
     * @var array<int, array{0: string, 1: string}>
     */
    public array $attachedPolicies = [];

    public function create(
        string $name,
        ?string $description = null,
        bool $hidden = false,
    ): self {
        $this->recordThat(new RoleCreated(
            name: $name,
            description: $description,
            hidden: $hidden,
        ));

        return $this;
    }

    public function update(
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

    public function close(string $reason): self
    {
        $this->recordThat(new RoleClosed(reason: $reason));

        return $this;
    }

    public function reopen(string $reason): self
    {
        $this->recordThat(new RoleReopened(reason: $reason));

        return $this;
    }

    public function destroy(): self
    {
        $this->recordThat(new RoleDestroyed);

        return $this;
    }

    public function attachPolicy(
        string $policy,
        string $ability,
        string $description = '',
        bool $hidden = false
    ): self {
        // Check if policy is already attached
        $policyKey = [$policy, $ability];
        if (in_array($policyKey, $this->attachedPolicies, true)) {
            return $this; // Policy already attached, no event recorded
        }

        $this->recordThat(new PolicyAttached(
            policy: $policy,
            ability: $ability,
            description: $description,
            hidden: $hidden
        ));

        return $this;
    }

    public function detachPolicy(string $policy, string $ability): self
    {
        // Check if policy is attached
        $policyKey = [$policy, $ability];
        if (! in_array($policyKey, $this->attachedPolicies, true)) {
            return $this; // Policy not attached, no event recorded
        }

        $this->recordThat(new PolicyDetached(
            policy: $policy,
            ability: $ability
        ));

        return $this;
    }

    public function deprecatePolicy(string $policy, string $ability): self
    {
        $this->recordThat(new PolicyDeprecated(
            policy: $policy,
            ability: $ability
        ));

        return $this;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyPolicyAttached(PolicyAttached $event): void
    {
        $this->attachedPolicies[] = [$event->policy, $event->ability];
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyPolicyDetached(PolicyDetached $event): void
    {
        $policyKey = [$event->policy, $event->ability];
        $index = array_search($policyKey, $this->attachedPolicies, true);
        if ($index !== false) {
            unset($this->attachedPolicies[$index]);
            $this->attachedPolicies = array_values($this->attachedPolicies);
        }
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyRoleClosed(RoleClosed $event): void
    {
        $this->closedAt = new DateTimeImmutable();
        $this->closedReason = $event->reason;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyRoleReopened(): void
    {
        $this->closedAt = null;
        $this->closedReason = null;
    }
}
