<?php

declare(strict_types=1);

namespace App\Http\Requests\Expense;

use App\Actions\ExpenseActions;
use App\Rules\FileRule;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class ExpenseCreateProcessRequest extends FormRequest
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
            'invoice_no' => ['required', 'string', 'max:255'],
            'invoice_date' => ['nullable', 'date'],
            'wholesaler_id' => ['required', 'string', 'exists:wholesalers,id'],
            'pages' => ['nullable', 'array'],
            'pages.*' => ['nullable', new FileRule()],
            'expense_items' => ['nullable', 'array'],
            'expense_items.*.item' => ['nullable', 'string'],
            'expense_items.*.quantity' => ['required', 'integer', 'min:0'],
            'expense_items.*.units' => ['required', 'integer', 'min:1'],
            'expense_items.*.cost' => ['required', 'integer', 'min:0'],
            'expense_items.*.rebate' => ['required', 'integer', 'min:0'],
            'expense_items.*.royalty' => ['required', 'integer', 'min:0'],
            'expense_items.*.price' => ['required', 'integer', 'min:0'],
        ];
    }

    public function respond(): Response
    {
        /** @var array{invoice_no: string, invoice_date?: string|null, wholesaler_id: string, pages?: array<mixed>, expense_items?: array<mixed>} $data */
        $data = $this->validated();

        /** @var \App\Models\User $user */
        $user = $this->user();

        $data['operator_id'] = $user->operator_id;

        ExpenseActions::create($data);

        return redirect()
            ->route('expenses.index')
            ->with('toast', [
                'message' => 'Expense created successfully',
                'type' => 'success',
            ]);
    }
}
