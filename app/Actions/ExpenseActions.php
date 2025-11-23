<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Expense;

final class ExpenseActions
{
    public Expense $expense;

    public function __construct(
        Expense|string $expense,
    ) {
        if (is_string($expense)) {
            /** @var Expense $expense */
            $expense = Expense::findOrFail($expense);
        }
        $this->expense = $expense;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public static function create(array $data): Expense
    {
        return Expense::create($data);
    }

    public function destroy(): void
    {
        $this->expense->delete();
    }
}
