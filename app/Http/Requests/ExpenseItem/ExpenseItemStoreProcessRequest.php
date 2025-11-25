<?php

declare(strict_types=1);

namespace App\Http\Requests\ExpenseItem;

use App\Actions\ExpenseItemActions;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class ExpenseItemStoreProcessRequest extends FormRequest
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
            'expense_id' => ['required', 'string', 'exists:expenses,id'],
        ];
    }

    public function respond(): Response
    {
        /** @var array{expense_id: string} $data */
        $data = $this->validated();

        ExpenseItemActions::store($data);

        return back()->with('toast', [
            'message' => 'Expense item added successfully',
            'type' => 'success',
        ]);
    }
}
