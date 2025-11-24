<?php

declare(strict_types=1);

namespace App\Http\Requests\ExpenseItem;

use App\Actions\ExpenseItemActions;
use App\Models\ExpenseItem;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class ExpenseItemDestroyProcessRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [];
    }

    public function respond(): Response
    {
        /** @var ExpenseItem $expenseItem */
        $expenseItem = $this->route('expense_item');

        new ExpenseItemActions($expenseItem)->destroy();

        return back();
    }
}
