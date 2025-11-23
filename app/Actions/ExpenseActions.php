<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Expense;
use App\Models\Wholesaler;

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

        if (isset($data['wholesaler_id'])) {
            /** @var Wholesaler $wholesaler */
            $wholesaler = Wholesaler::findOrFail($data['wholesaler_id']);
            $data['__wholesaler_name'] = $wholesaler->name;
        }

        Wholesaler::whereKey($data['wholesaler_id'])->increment('__expenses_count');

        return Expense::create($data);
    }

    public function destroy(): void
    {

        Wholesaler::whereKey($this->expense->wholesaler_id)->decrement('__expenses_count');
        $this->expense->delete();
    }
}
