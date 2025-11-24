<?php

declare(strict_types=1);

namespace App\Http\Controllers\Expense;

use App\Http\Requests\Expense\ExpenseUpdateProcessRequest;
use App\Http\Requests\Expense\ExpenseUpdateViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class ExpenseUpdateController
{
    public function view(ExpenseUpdateViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(ExpenseUpdateProcessRequest $request): Response
    {
        return $request->respond();
    }
}
