<?php

declare(strict_types=1);

namespace App\Projectors;

use App\Events\Expense\ExpenseCreated;
use App\Events\Expense\ExpenseDestroyed;
use App\Models\Expense;
use App\Models\Wholesaler;
use Spatie\EventSourcing\EventHandlers\Projectors\Projector;
use Spatie\EventSourcing\StoredEvents\StoredEvent;

final class ExpenseProjector extends Projector
{
    private ?string $aggregateUuid = null;

    public function handle(StoredEvent $storedEvent): void
    {
        $this->aggregateUuid = $storedEvent->aggregate_uuid;

        parent::handle($storedEvent);
    }

    public function onExpenseCreated(ExpenseCreated $event): void
    {
        $wholesaler = Wholesaler::findOrFail($event->wholesalerId);

        Expense::create([
            'id' => $this->aggregateUuid,
            'operator_id' => $event->operatorId,
            'wholesaler_id' => $event->wholesalerId,
            'invoice_no' => $event->invoiceNo,
            'invoice_date' => $event->invoiceDate,
            '__wholesaler_name' => $wholesaler->name,
        ]);
    }

    public function onExpenseDestroyed(ExpenseDestroyed $event): void
    {
        $expense = Expense::findOrFail($this->aggregateUuid);

        $expense->delete();
    }
}
