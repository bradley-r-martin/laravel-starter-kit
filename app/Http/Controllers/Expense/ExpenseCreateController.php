<?php

declare(strict_types=1);

namespace App\Http\Controllers\Expense;

use App\Http\Requests\Expense\ExpenseCreateProcessRequest;
use App\Http\Requests\Expense\ExpenseCreateViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class ExpenseCreateController
{
    public function view(ExpenseCreateViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(ExpenseCreateProcessRequest $request): Response
    {
        return $request->respond();
    }
}
