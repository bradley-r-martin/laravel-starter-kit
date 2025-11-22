<?php

declare(strict_types=1);

namespace App\Events\Expense;

use DateTimeImmutable;
use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class ExpenseCreated extends ShouldBeStored
{
    public function __construct(
        public string $operatorId,
        public string $wholesalerId,
        public string $invoiceNo,
        public ?DateTimeImmutable $invoiceDate = null,
    ) {}
}
