<?php

declare(strict_types=1);

namespace App\Projectors;

use App\Events\Operator\OperatorClosed;
use App\Events\Operator\OperatorCreated;
use App\Events\Operator\OperatorDestroyed;
use App\Events\Operator\OperatorReopened;
use App\Events\Operator\OperatorSuspended;
use App\Events\Operator\OperatorUnsuspended;
use App\Events\Operator\OperatorUpdated;
use App\Models\Operator;
use Spatie\EventSourcing\EventHandlers\Projectors\Projector;
use Spatie\EventSourcing\StoredEvents\StoredEvent;

final class OperatorProjector extends Projector
{
    private ?string $aggregateUuid = null;

    public function handle(StoredEvent $storedEvent): void
    {
        $this->aggregateUuid = $storedEvent->aggregate_uuid;

        parent::handle($storedEvent);
    }

    public function onOperatorCreated(OperatorCreated $event): void
    {
        Operator::create([
            'id' => $this->aggregateUuid,
            'name' => $event->name,
            'email' => $event->email,
            'address' => $event->address,
            'phone' => $event->phone,
            'entity' => $event->entity,
            'image' => $event->image,
        ]);
    }

    public function onOperatorUpdated(OperatorUpdated $event): void
    {
        $operator = Operator::findOrFail($this->aggregateUuid);

        $updates = [];

        if ($event->name !== null) {
            $updates['name'] = $event->name;
        }

        if ($event->emailTouched) {
            $updates['email'] = $event->email;
        }

        if ($event->addressTouched) {
            $updates['address'] = $event->address;
        }

        if ($event->phoneTouched) {
            $updates['phone'] = $event->phone;
        }

        if ($event->entityTouched) {
            $updates['entity'] = $event->entity;
        }

        if ($event->imageTouched) {
            $updates['image'] = $event->image;
        }

        if ($updates !== []) {
            $operator->update($updates);
        }
    }

    public function onOperatorClosed(OperatorClosed $event): void
    {
        $operator = Operator::findOrFail($this->aggregateUuid);

        $operator->update([
            'closed_at' => now(),
        ]);
    }

    public function onOperatorReopened(OperatorReopened $event): void
    {
        $operator = Operator::findOrFail($this->aggregateUuid);

        $operator->update([
            'closed_at' => null,
        ]);
    }

    public function onOperatorSuspended(OperatorSuspended $event): void
    {
        $operator = Operator::findOrFail($this->aggregateUuid);

        $operator->update([
            'suspended_at' => now(),
        ]);
    }

    public function onOperatorUnsuspended(OperatorUnsuspended $event): void
    {
        $operator = Operator::findOrFail($this->aggregateUuid);

        $operator->update([
            'suspended_at' => null,
        ]);
    }

    public function onOperatorDestroyed(OperatorDestroyed $event): void
    {
        $operator = Operator::findOrFail($this->aggregateUuid);

        $operator->delete();
    }
}
