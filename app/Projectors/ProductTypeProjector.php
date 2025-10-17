<?php

declare(strict_types=1);

namespace App\Projectors;

use App\Events\ProductType\ProductTypeClosed;
use App\Events\ProductType\ProductTypeCreated;
use App\Events\ProductType\ProductTypeDestroyed;
use App\Events\ProductType\ProductTypeReopened;
use App\Events\ProductType\ProductTypeUpdated;
use App\Models\ProductType;
use Spatie\EventSourcing\EventHandlers\Projectors\Projector;
use Spatie\EventSourcing\StoredEvents\StoredEvent;

final class ProductTypeProjector extends Projector
{
    private ?string $aggregateUuid = null;

    public function handle(StoredEvent $storedEvent): void
    {
        $this->aggregateUuid = $storedEvent->aggregate_uuid;

        parent::handle($storedEvent);
    }

    public function onProductTypeCreated(ProductTypeCreated $event): void
    {
        ProductType::create([
            'id' => $this->aggregateUuid,
            'name' => $event->name,
        ]);
    }

    public function onProductTypeUpdated(ProductTypeUpdated $event): void
    {
        $productType = ProductType::findOrFail($this->aggregateUuid);

        $updates = [];

        if ($event->name !== null) {
            $updates['name'] = $event->name;
        }

        if ($updates !== []) {
            $productType->update($updates);
        }
    }

    public function onProductTypeClosed(ProductTypeClosed $event): void
    {
        $productType = ProductType::findOrFail($this->aggregateUuid);

        $productType->update([
            'closed_at' => now(),
        ]);
    }

    public function onProductTypeReopened(ProductTypeReopened $event): void
    {
        $productType = ProductType::findOrFail($this->aggregateUuid);

        $productType->update([
            'closed_at' => null,
        ]);
    }

    public function onProductTypeDestroyed(ProductTypeDestroyed $event): void
    {
        $productType = ProductType::findOrFail($this->aggregateUuid);

        $productType->delete();
    }
}
