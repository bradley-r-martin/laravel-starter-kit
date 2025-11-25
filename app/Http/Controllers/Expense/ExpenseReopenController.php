<?php

declare(strict_types=1);

namespace App\Http\Controllers\Expense;

use App\Http\Requests\Expense\ExpenseReopenProcessRequest;
use App\Http\Requests\Expense\ExpenseReopenViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class ExpenseReopenController
{
    public function view(ExpenseReopenViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(ExpenseReopenProcessRequest $request): Response
    {
        return $request->respond();
    }
}
