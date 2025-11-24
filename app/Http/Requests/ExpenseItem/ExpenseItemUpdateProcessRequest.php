<?php

declare(strict_types=1);

namespace App\Http\Requests\ExpenseItem;

use App\Actions\ExpenseItemActions;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class ExpenseItemUpdateProcessRequest extends FormRequest
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
        return [
            'product_id' => ['sometimes', 'nullable', 'string', 'exists:products,id'],
            'units' => ['sometimes', 'integer', 'min:0'],
            'cost' => ['sometimes', 'integer', 'min:0'],
        ];
    }

    public function respond(): Response
    {
        /** @var array{product_id?: string|null, quantity?: int, price?: int} $data */
        $data = $this->validated();

        $expenseItem = new ExpenseItemActions((string) $this->route('expense_item'))->update($data);

        return redirect()->route('expenses.show', $expenseItem->expense_id)->with('toast', [
            'message' => 'Expense item updated successfully',
            'type' => 'success',
        ]);
    }
}
