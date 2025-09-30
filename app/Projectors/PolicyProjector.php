<?php

declare(strict_types=1);

namespace App\Projectors;

use App\Events\Policy\PolicyAttached;
use App\Events\Policy\PolicyDeprecated;
use App\Events\Policy\PolicyDetached;
use App\Models\Policy;
use Spatie\EventSourcing\EventHandlers\Projectors\Projector;

final class PolicyProjector extends Projector
{
    public function onPolicyAttached(PolicyAttached $event): void
    {
        // Get the role ID from the event context
        $roleId = $event->metaData['role_id'] ?? null;

        if (! $roleId) {
            return;
        }

        Policy::create([
            'policy' => $event->policy,
            'ability' => $event->ability,
            'role_id' => $roleId,
            'description' => $event->description,
            'hidden' => $event->hidden,
        ]);
    }

    public function onPolicyDetached(PolicyDetached $event): void
    {
        // Get the role ID from the event context
        $roleId = $event->metaData['role_id'] ?? null;

        if (! $roleId) {
            return;
        }

        // Find and delete the detached policy
        Policy::query()
            ->where('policy', $event->policy)
            ->where('ability', $event->ability)
            ->where('role_id', $roleId)
            ->delete();
    }

    public function onPolicyDeprecated(PolicyDeprecated $event): void
    {
        // Find and delete the deprecated policy
        Policy::query()
            ->where('policy', $event->policy)
            ->where('ability', $event->ability)
            ->delete();
    }
}
