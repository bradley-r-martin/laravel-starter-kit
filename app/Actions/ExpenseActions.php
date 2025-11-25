<?php

declare(strict_types=1);

namespace App\Actions;

use App\Domain\File;
use App\Models\Expense;
use App\Models\ExpenseItem;
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

        // Process pages if they are present
        if (isset($data['pages']) && is_array($data['pages'])) {
            $persistedPages = [];
            foreach ($data['pages'] as $page) {
                if (is_array($page)) {
                    // Convert array to File object and persist it
                    /** @var array<string, int|string|null> $page */
                    $file = File::fromArray($page);
                    $persistedFile = $file->persist('public', 'expenses');
                    $persistedPages[] = $persistedFile->toArray();
                }
            }
            $data['pages'] = $persistedPages;
        }

        // Extract expense items before creating expense
        $expenseItems = $data['expense_items'] ?? [];
        unset($data['expense_items']);

        Wholesaler::whereKey($data['wholesaler_id'])->increment('__expenses_count');

        $expense = Expense::create($data);

        // Create expense items if they exist
        if (! empty($expenseItems) && is_array($expenseItems)) {
            foreach ($expenseItems as $item) {
                if (is_array($item)) {
                    ExpenseItem::create([
                        'expense_id' => $expense->id,
                        'wholesaler_id' => $data['wholesaler_id'],
                        'operator_id' => $data['operator_id'],
                        'item' => $item['item'] ?? null,
                        'quantity' => $item['quantity'] ?? 0,
                        'units' => $item['units'] ?? 1,
                        'cost' => $item['cost'] ?? 0,
                        'rebate' => $item['rebate'] ?? 0,
                        'royalty' => $item['royalty'] ?? 0,
                        'price' => $item['price'] ?? 0,
                    ]);
                }
            }

            // Update expense totals
            self::updateExpenseTotals($expense);
        }

        return $expense;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(array $data): Expense
    {
        // Handle wholesaler assignment/change
        if (array_key_exists('wholesaler_id', $data)) {
            $oldWholesalerId = $this->expense->wholesaler_id;
            $newWholesalerId = $data['wholesaler_id'];

            if ($newWholesalerId !== null) {
                /** @var Wholesaler $wholesaler */
                $wholesaler = Wholesaler::findOrFail($newWholesalerId);
                $data['__wholesaler_name'] = $wholesaler->name;

                // Update wholesaler counts if wholesaler changed
                if ($oldWholesalerId !== $newWholesalerId) {
                    if ($oldWholesalerId) {
                        Wholesaler::whereKey($oldWholesalerId)->decrement('__expenses_count');
                    }
                    Wholesaler::whereKey($newWholesalerId)->increment('__expenses_count');
                }
            }
        }

        $this->expense->update($data);
        $this->expense->refresh();

        return $this->expense;
    }

    public function complete(): Expense
    {
        $this->expense->update([
            'completed_at' => now(),
        ]);
        $this->expense->refresh();

        return $this->expense;
    }

    public function destroy(): void
    {

        Wholesaler::whereKey($this->expense->wholesaler_id)->decrement('__expenses_count');
        $this->expense->delete();
    }

    /**
     * Update the expense totals based on expense items
     */
    private static function updateExpenseTotals(Expense $expense): void
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
}
