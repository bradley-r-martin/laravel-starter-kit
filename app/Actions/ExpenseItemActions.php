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
     * Create a new expense item
     *
     * @param  array<string, mixed>  $data
     */
    public static function store(array $data): ExpenseItem
    {
        /** @var Expense $expense */
        $expense = Expense::findOrFail($data['expense_id']);

        $expenseItem = ExpenseItem::create([
            'expense_id' => $data['expense_id'],
            'item' => null,
            'units' => 1,
            'cost' => 0,
            'rebate' => 0,
            'royalty' => 0,
            'quantity' => 0,
            'price' => 0,
            'product_id' => null,
        ]);

        // Update expense totals after item creation
        self::updateExpenseTotalsForExpense($expense);

        return $expenseItem;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(array $data): ExpenseItem
    {

        // Handle product assignment/change
        if (array_key_exists('product_id', $data)) {
            $product = Product::find($data['product_id']);

            $newProductId = $data['product_id'];

            if ($newProductId !== null) {
                /** @var Product $product */
                $product = Product::find($newProductId);
                $data['__product_name'] = $product->name;
            } else {
                $data['__product_name'] = null;
                $data['price'] = 0;
                $data['quantity'] = 0;
                $data['rebate'] = 0;
                $data['royalty'] = 0;
            }
        }

        if ((array_key_exists('product_id', $data) && $data['product_id'] !== null)) {
            /** @var Product $product */
            $product = Product::find($data['product_id']);
            $data['price'] = $product->price;
            $data['quantity'] = $product->units * $this->expenseItem->units;
            $data['rebate'] = $product->rebate * $data['quantity'];
            $data['royalty'] = $product->royalty * $data['quantity'];
        }

        $this->expenseItem->update($data);

        // Update expense totals after item update
        $this->updateExpenseTotals();

        $this->expenseItem->refresh();

        return $this->expenseItem;
    }

    public function destroy(): void
    {
        /** @var Expense $expense */
        $expense = $this->expenseItem->expense;

        $this->expenseItem->delete();

        // Update expense totals after item deletion
        self::updateExpenseTotalsForExpense($expense);
    }

    /**
     * Update the expense totals for a given expense
     */
    private static function updateExpenseTotalsForExpense(Expense $expense): void
    {
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

    /**
     * Update the expense totals based on expense items
     */
    private function updateExpenseTotals(): void
    {
        /** @var Expense $expense */
        $expense = $this->expenseItem->expense;

        self::updateExpenseTotalsForExpense($expense);
    }
}
