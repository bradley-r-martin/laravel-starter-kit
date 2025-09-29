<?php

declare(strict_types=1);

namespace App\Aggregates;

use App\Events\Policy\PolicyCreated;
use App\Events\Policy\PolicyDestroyed;
use App\Events\Policy\PolicyUpdated;
use Spatie\EventSourcing\AggregateRoots\AggregateRoot;

final class PolicyAggregate extends AggregateRoot
{
    public ?string $uuid = null;

    public ?string $policy = null;

    public ?string $ability = null;

    public ?string $description = null;

    public bool $hidden = false;

    public function createPolicy(
        string $namespace,
        string $policy,
        string $ability,
        ?string $description = null,
        bool $hidden = false,
    ): self {
        $this->recordThat(new PolicyCreated(
            namespace: $namespace,
            policy: $policy,
            ability: $ability,
            description: $description,
            hidden: $hidden,
        ));

        return $this;
    }

    public function updatePolicy(
        ?string $policy = null,
        ?string $ability = null,
        ?string $description = null,
        ?bool $hidden = null,
    ): self {
        $this->recordThat(new PolicyUpdated(
            namespace: $this->uuid ?? '',
            policy: $policy,
            ability: $ability,
            description: $description,
            hidden: $hidden,
        ));

        return $this;
    }

    public function destroyPolicy(): self
    {
        $this->recordThat(new PolicyDestroyed(namespace: $this->uuid ?? ''));

        return $this;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyPolicyCreated(PolicyCreated $event): void
    {
        $this->uuid = $event->namespace;
        $this->policy = $event->policy;
        $this->ability = $event->ability;
        $this->description = $event->description;
        $this->hidden = $event->hidden;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyPolicyUpdated(PolicyUpdated $event): void
    {
        if ($event->policy !== null) {
            $this->policy = $event->policy;
        }

        if ($event->ability !== null) {
            $this->ability = $event->ability;
        }

        if ($event->description !== null) {
            $this->description = $event->description;
        }

        if ($event->hidden !== null) {
            $this->hidden = $event->hidden;
        }
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyPolicyDestroyed(): void
    {
        $this->policy = null;
        $this->ability = null;
        $this->description = null;
        $this->hidden = false;
    }
}
