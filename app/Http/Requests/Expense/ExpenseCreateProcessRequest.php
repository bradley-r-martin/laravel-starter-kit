<?php

declare(strict_types=1);

namespace App\Http\Requests\Expense;

use App\Aggregates\ExpenseAggregate;
use DateTimeImmutable;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
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
        ];
    }

    public function respond(): Response
    {
        /** @var array{invoice_no: string, invoice_date?: string|null, wholesaler_id: string} $data */
        $data = $this->validated();

        /** @var \App\Models\User $user */
        $user = $this->user();

        $operator = $user->operator;

        if (! $operator) {
            abort(403, 'User must be associated with an operator');
        }

        $expenseId = (string) Str::ulid();

        $invoiceDate = null;
        if (isset($data['invoice_date']) && $data['invoice_date']) {
            $invoiceDate = DateTimeImmutable::createFromFormat('Y-m-d', $data['invoice_date']);
            if ($invoiceDate === false) {
                abort(422, 'Invalid invoice date format');
            }
            $invoiceDate = $invoiceDate->setTime(0, 0, 0);
        }

        ExpenseAggregate::retrieve($expenseId)
            ->create(
                operatorId: $operator->id,
                wholesalerId: $data['wholesaler_id'],
                invoiceNo: $data['invoice_no'],
                invoiceDate: $invoiceDate,
            )
            ->persist();

        return redirect()
            ->route('expenses.index')
            ->with('toast', [
                'message' => 'Expense created successfully',
                'type' => 'success',
            ]);
    }
}
