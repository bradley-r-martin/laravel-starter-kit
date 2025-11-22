<?php

declare(strict_types=1);

namespace App\Aggregates;

use App\Events\Expense\ExpenseCreated;
use App\Events\Expense\ExpenseDestroyed;
use DateTimeImmutable;
use Spatie\EventSourcing\AggregateRoots\AggregateRoot;

final class ExpenseAggregate extends AggregateRoot
{
    public ?string $operatorId = null;

    public ?string $wholesalerId = null;

    public ?string $invoiceNo = null;

    public ?DateTimeImmutable $invoiceDate = null;

    public ?DateTimeImmutable $destroyedAt = null;

    public ?string $destroyedReason = null;

    public function create(
        string $operatorId,
        string $wholesalerId,
        string $invoiceNo,
        ?DateTimeImmutable $invoiceDate = null,
    ): self {
        $this->recordThat(new ExpenseCreated(
            operatorId: $operatorId,
            wholesalerId: $wholesalerId,
            invoiceNo: $invoiceNo,
            invoiceDate: $invoiceDate,
        ));

        return $this;
    }

    public function destroy(
        string $reason,
    ): self {
        $this->recordThat(new ExpenseDestroyed(
            reason: $reason,
        ));

        return $this;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyExpenseCreated(ExpenseCreated $event): void
    {
        $this->operatorId = $event->operatorId;
        $this->wholesalerId = $event->wholesalerId;
        $this->invoiceNo = $event->invoiceNo;
        $this->invoiceDate = $event->invoiceDate;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyExpenseDestroyed(ExpenseDestroyed $event): void
    {
        $this->destroyedAt = new DateTimeImmutable();
        $this->destroyedReason = $event->reason;
    }
}
