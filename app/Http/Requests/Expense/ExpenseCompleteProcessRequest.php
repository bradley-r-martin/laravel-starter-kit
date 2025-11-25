<?php

declare(strict_types=1);

namespace App\Http\Requests\Expense;

use App\Actions\ExpenseActions;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class ExpenseCompleteProcessRequest extends FormRequest
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
        $expense = new ExpenseActions($expenseId);
        $expense->complete();

        return redirect()
            ->route('expenses.show', $expense->expense->id)
            ->with('toast', [
                'message' => 'Expense marked as complete',
                'type' => 'success',
            ]);
    }
}
