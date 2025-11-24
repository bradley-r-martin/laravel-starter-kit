<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Expense;
use App\Models\ExpenseItem;
use App\Models\Product;

final class ExpenseItemActions
{
    public ExpenseItem $expenseItem;

    public function __construct(
        ExpenseItem|string $expenseItem,
    ) {
        if (is_string($expenseItem)) {
            /** @var ExpenseItem $expenseItem */
            $expenseItem = ExpenseItem::findOrFail($expenseItem);
        }
        $this->expenseItem = $expenseItem;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(array $data): ExpenseItem
    {
        // Handle product assignment/change
        if (array_key_exists('product_id', $data)) {
            $newProductId = $data['product_id'];

            if ($newProductId !== null) {
                /** @var Product $product */
                $product = Product::findOrFail($newProductId);
                $data['__product_name'] = $product->name;
            } else {
                $data['__product_name'] = null;
            }
        }

        $this->expenseItem->update($data);

        // Update expense totals after item update
        $this->updateExpenseTotals();

        $this->expenseItem->refresh();

        return $this->expenseItem;
    }

    /**
     * Update the expense totals based on expense items
     */
    private function updateExpenseTotals(): void
    {
        /** @var Expense $expense */
        $expense = $this->expenseItem->expense;

        $totals = ExpenseItem::where('expense_id', $expense->id)
            ->selectRaw('
                SUM(cost) as total_cost,
                SUM(rebate) as total_rebate,
                SUM(royalty) as total_royalty
            ')
            ->first();

        $expense->update([
            '__cost' => $totals->total_cost ?? 0,
            '__rebate' => $totals->total_rebate ?? 0,
            '__royalty' => $totals->total_royalty ?? 0,
        ]);
    }
}
