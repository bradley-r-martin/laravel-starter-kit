<?php

declare(strict_types=1);

namespace App\Http\Requests\Expense;

use App\Actions\ExpenseActions;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class ExpenseReopenProcessRequest extends FormRequest
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
            'reason' => ['required', 'string', 'max:500'],
        ];
    }

    public function respond(): Response
    {
        $this->validated();

        $expenseId = (string) $this->route('expense');
        $expense = new ExpenseActions($expenseId);
        $expense->reopen();

        return redirect()
            ->route('expenses.show', $expense->expense->id)
            ->with('toast', [
                'message' => 'Expense reopened successfully',
                'type' => 'success',
            ]);
    }
}
