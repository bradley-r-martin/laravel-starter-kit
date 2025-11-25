<?php

declare(strict_types=1);

namespace App\Http\Requests\Expense;

use App\Models\Expense;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class ExpenseListViewRequest extends FormRequest
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
        $expenses = Expense::query()
            ->owned()
            ->filterSortBy($this->string('expenses_sort')->toString())
            ->filterBySearch($this->string('expenses_search')->toString())
            ->filterByStatus($this->string('expenses_status')->toString())
            ->paginate(10, ['*'], 'expenses_page')
            /** @var \Illuminate\Contracts\Pagination\LengthAwarePaginator<array{Expense $expense}> $expenses */
            ->through(fn (Expense $expense): array => $expense->toArray());

        return inertia()
            ->render('Expense/List', [
                'expenses' => $expenses,
            ])
            ->toResponse($this);
    }
}
