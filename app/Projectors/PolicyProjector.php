<?php

declare(strict_types=1);

namespace App\Projectors;

use App\Events\Policy\PolicyAttached;
use App\Events\Policy\PolicyDeprecated;
use App\Events\Policy\PolicyDetached;
use App\Models\Policy;
use Spatie\EventSourcing\EventHandlers\Projectors\Projector;
use Spatie\EventSourcing\StoredEvents\StoredEvent;

final class PolicyProjector extends Projector
{
    private ?string $aggregateUuid = null;

    public function handle(StoredEvent $storedEvent): void
    {
        $this->aggregateUuid = $storedEvent->aggregate_uuid;

        parent::handle($storedEvent);
    }

    public function onPolicyAttached(PolicyAttached $event): void
    {
        if (! $this->aggregateUuid) {
            return;
        }

        Policy::create([
            'policy' => $event->policy,
            'ability' => $event->ability,
            'role_id' => $this->aggregateUuid,
            'description' => $event->description,
            'hidden' => $event->hidden,
        ]);
    }

    public function onPolicyDetached(PolicyDetached $event): void
    {
        if (! $this->aggregateUuid) {
            return;
        }

        // Find and delete the detached policy
        Policy::query()
            ->where('policy', $event->policy)
            ->where('ability', $event->ability)
            ->where('role_id', $this->aggregateUuid)
            ->delete();
    }

    public function onPolicyDeprecated(PolicyDeprecated $event): void
    {
        if (! $this->aggregateUuid) {
            return;
        }

        // Find and delete the deprecated policy
        Policy::query()
            ->where('policy', $event->policy)
            ->where('ability', $event->ability)
            ->where('role_id', $this->aggregateUuid)
            ->delete();
    }
}
