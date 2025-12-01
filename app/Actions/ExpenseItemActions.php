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
            'quantity' => 1,
            'price' => 0,
            'product_rebate' => 0,
            'product_royalty' => 0,
            'product_units' => 0,
            'product_retail_price' => 0,
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

        // Handle product
        if (array_key_exists('product_id', $data) || array_key_exists('quantity', $data)) {
            if (array_key_exists('product_id', $data) && $data['product_id'] === null) {
                $data['__product_name'] = null;
                $data['product_retail_price'] = 0;
                $data['product_units'] = 0;
                $data['product_rebate'] = 0;
                $data['product_royalty'] = 0;
            } else {
                $id = $data['product_id'] ?? $this->expenseItem->product_id;
                $product = Product::find($id);
                $data['__product_name'] = $product->name;
                $data['product_retail_price'] = $product->price;
                $quantity = $data['quantity'] ?? $this->expenseItem->quantity;
                $data['product_units'] = $product->units * $quantity;
                $data['product_rebate'] = $product->rebate * $quantity;
                $data['product_royalty'] = $product->royalty * $quantity;
            }
        }

        $this->expenseItem->update($data);

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
                SUM(product_retail_price) as total_product_retail_price,
                SUM(product_rebate) as total_product_rebate,
                SUM(product_royalty) as total_product_royalty,
                SUM(product_units) as total_product_units
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
