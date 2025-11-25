<?php

declare(strict_types=1);

namespace App\Http\Requests\Expense;

use App\Models\Expense;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class ExpenseCompleteViewRequest extends FormRequest
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
            ->findOrFail($expenseId);

        return inertia()
            ->modal('Expense/Complete', [
                'expense' => [
                    'id' => $expense->id,
                    'invoice_no' => $expense->invoice_no,
                ],
            ])
            ->baseRoute('expenses.show', $expense->id)
            ->toResponse($this);
    }
}
