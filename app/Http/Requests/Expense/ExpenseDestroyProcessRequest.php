<?php

declare(strict_types=1);

namespace App\Http\Requests\Expense;

use App\Aggregates\ExpenseAggregate;
use App\Models\Expense;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class ExpenseDestroyProcessRequest extends FormRequest
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
            'reason' => ['required', 'string', 'max:255'],
        ];
    }

    public function respond(): Response
    {
        /** @var Expense $expense */
        $expense = Expense::findOrFail($this->route('expense'));

        /** @var array{reason: string} $data */
        $data = $this->validated();

        ExpenseAggregate::retrieve($expense->id)
            ->destroy(
                reason: $data['reason'],
            )
            ->persist();

        return redirect()
            ->route('expenses.index')
            ->with('toast', [
                'message' => 'Expense destroyed successfully',
                'type' => 'success',
            ]);
    }
}
