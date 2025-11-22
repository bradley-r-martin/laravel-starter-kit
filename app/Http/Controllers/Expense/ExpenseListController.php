<?php

declare(strict_types=1);

namespace App\Http\Controllers\Expense;

use App\Http\Requests\Expense\ExpenseListViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class ExpenseListController
{
    public function view(ExpenseListViewRequest $request): Response
    {
        return $request->respond();
    }
}
