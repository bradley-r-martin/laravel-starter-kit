<?php

declare(strict_types=1);

namespace App\Http\Requests\Expense;

use App\Actions\ExpenseActions;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class ExpenseUpdateProcessRequest extends FormRequest
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
            'invoice_no' => ['sometimes', 'string', 'max:255'],
            'invoice_date' => ['sometimes', 'nullable', 'date'],
            'wholesaler_id' => ['sometimes', 'string', 'exists:wholesalers,id'],
        ];
    }

    public function respond(): Response
    {
        /** @var array{invoice_no?: string, invoice_date?: string|null, wholesaler_id?: string} $data */
        $data = $this->validated();

        $expenseId = (string) $this->route('expense');
        $expense = new ExpenseActions($expenseId);
        $expense->update($data);

        return redirect()
            ->route('expenses.show', $expense->expense->id)
            ->with('toast', [
                'message' => 'Expense updated successfully',
                'type' => 'success',
            ]);
    }
}
