<?php

declare(strict_types=1);

namespace App\Events\Expense;

use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class ExpenseDestroyed extends ShouldBeStored
{
    public function __construct(
        public string $reason,
    ) {}
}
