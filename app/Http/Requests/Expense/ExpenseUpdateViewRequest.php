<?php

declare(strict_types=1);

namespace App\Http\Requests\Expense;

use App\Models\Expense;
use App\Models\Wholesaler;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class ExpenseUpdateViewRequest extends FormRequest
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

        $wholesalers = Wholesaler::query()
            ->orderBy('name')
            ->get()
            ->map(fn (Wholesaler $wholesaler): array => [
                'id' => $wholesaler->id,
                'name' => $wholesaler->name,
            ]);

        return inertia()
            ->modal('Expense/Update', [
                'expense' => [
                    'id' => $expense->id,
                    'invoice_no' => $expense->invoice_no,
                    'invoice_date' => $expense->invoice_date,
                    'wholesaler_id' => $expense->wholesaler_id,
                ],
                'wholesalers' => $wholesalers,
            ])
            ->baseRoute('expenses.show', $expense->id)
            ->toResponse($this);
    }
}
