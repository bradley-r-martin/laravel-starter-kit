<?php

declare(strict_types=1);

namespace App\Http\Requests\Expense;

use App\Models\Expense;
use App\Models\ExpenseItem;
use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class ExpenseDetailViewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [];
    }

    public function respond(): Response
    {
        $expenseId = (string) $this->route('expense');
        $expense = Expense::query()
            ->with(['operator', 'expenseItems.product'])
            ->findOrFail($expenseId);

        return inertia()
            ->render('Expense/View', [
                'expense' => [
                    'id' => $expense->id,
                    'invoice_no' => $expense->invoice_no,
                    'invoice_date' => $expense->invoice_date,
                    'pages' => $expense->pages,
                    'completed_at' => $expense->completed_at,
                    'created_at' => $expense->created_at,
                    '__wholesaler_name' => $expense->__wholesaler_name,
                    '__cost' => $expense->__cost,
                    '__rebate' => $expense->__rebate,
                    '__royalty' => $expense->__royalty,
                    'expense_items' => $expense->expenseItems->map(fn (ExpenseItem $item): array => [

                        'id' => $item->id,
                        'item' => $item->item,
                        'product_id' => $item->product_id,
                        'units' => $item->units,
                        'cost' => $item->cost,
                        'rebate' => $item->rebate,
                        'royalty' => $item->royalty,
                        'quantity' => $item->quantity,
                        'price' => $item->price,

                        '__product_name' => $item->__product_name,
                    ]),
                ],
                'products' => Product::query()
                    ->get()
                    ->map(fn (Product $product): array => [
                        'id' => $product->id,
                        'name' => $product->name,
                    ]),
            ])
            ->toResponse($this);
    }
}
