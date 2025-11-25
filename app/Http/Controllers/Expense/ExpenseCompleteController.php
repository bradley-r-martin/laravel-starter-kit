<?php

declare(strict_types=1);

namespace App\Http\Controllers\Expense;

use App\Http\Requests\Expense\ExpenseCompleteProcessRequest;
use App\Http\Requests\Expense\ExpenseCompleteViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class ExpenseCompleteController
{
    public function view(ExpenseCompleteViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(ExpenseCompleteProcessRequest $request): Response
    {
        return $request->respond();
    }
}
