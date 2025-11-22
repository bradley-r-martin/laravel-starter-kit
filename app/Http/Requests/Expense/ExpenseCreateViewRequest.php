<?php

declare(strict_types=1);

namespace App\Http\Requests\Expense;

use App\Models\Wholesaler;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class ExpenseCreateViewRequest extends FormRequest
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
        $wholesalers = Wholesaler::query()
            ->whereNull('closed_at')
            ->orderBy('name')
            ->get()
            ->map(fn (Wholesaler $wholesaler): array => [
                'id' => $wholesaler->id,
                'name' => $wholesaler->name,
            ]);

        return inertia()
            ->modal('Expense/Create', [
                'wholesalers' => $wholesalers,
            ])
            ->baseRoute('expenses.index')
            ->toResponse($this);
    }
}
