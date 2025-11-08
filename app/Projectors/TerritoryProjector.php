<?php

declare(strict_types=1);

namespace App\Projectors;

use App\Events\Territory\TerritoryClosed;
use App\Events\Territory\TerritoryCreated;
use App\Events\Territory\TerritoryDestroyed;
use App\Events\Territory\TerritoryReopened;
use App\Events\Territory\TerritoryUpdated;
use App\Models\Operator;
use App\Models\Territory;
use Spatie\EventSourcing\EventHandlers\Projectors\Projector;
use Spatie\EventSourcing\StoredEvents\StoredEvent;

final class TerritoryProjector extends Projector
{
    private ?string $aggregateUuid = null;

    public function handle(StoredEvent $storedEvent): void
    {
        $this->aggregateUuid = $storedEvent->aggregate_uuid;

        parent::handle($storedEvent);
    }

    public function onTerritoryCreated(TerritoryCreated $event): void
    {
        Territory::create([
            'id' => $this->aggregateUuid,
            'operator_id' => $event->operatorId,
            'merchant_account_id' => $event->merchantAccountId,
            'name' => $event->name,
            '__operator_name' => Operator::query()->whereKey($event->operatorId)->value('name'),
        ]);
    }

    public function onTerritoryUpdated(TerritoryUpdated $event): void
    {
        $territory = Territory::findOrFail($this->aggregateUuid);

        $updates = [];

        if ($event->operatorId !== null) {
            $updates['operator_id'] = $event->operatorId;
            $updates['__operator_name'] = Operator::query()->whereKey($event->operatorId)->value('name');
        }

        if ($event->merchantAccountIdTouched) {
            $updates['merchant_account_id'] = $event->merchantAccountId;
        }

        if ($event->name !== null) {
            $updates['name'] = $event->name;
        }

        if ($updates !== []) {
            $territory->update($updates);
        }
    }

    public function onTerritoryClosed(TerritoryClosed $event): void
    {
        $territory = Territory::findOrFail($this->aggregateUuid);

        $territory->update([
            'closed_at' => now(),
        ]);
    }

    public function onTerritoryReopened(TerritoryReopened $event): void
    {
        $territory = Territory::findOrFail($this->aggregateUuid);

        $territory->update([
            'closed_at' => null,
        ]);
    }

    public function onTerritoryDestroyed(TerritoryDestroyed $event): void
    {
        $territory = Territory::findOrFail($this->aggregateUuid);

        $territory->delete();
    }
}
