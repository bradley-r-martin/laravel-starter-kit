<?php

declare(strict_types=1);

namespace App\Http\Requests\ExpenseItem;

use App\Models\ExpenseItem;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class ExpenseItemDestroyViewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [];
    }

    public function respond(): Response
    {
        /** @var ExpenseItem $expenseItem */
        $expenseItem = ExpenseItem::findOrFail($this->route('expense_item'));

        return inertia()->modal('ExpenseItem/Destroy', [
            'expenseItem' => [
                'id' => $expenseItem->id,
                'item' => $expenseItem->item,
                'expense_id' => $expenseItem->expense_id,
            ],
        ])->baseRoute('expenses.show', $expenseItem->expense_id)->toResponse($this);
    }
}
