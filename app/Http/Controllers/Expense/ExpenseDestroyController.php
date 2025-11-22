<?php

declare(strict_types=1);

namespace App\Http\Controllers\Expense;

use App\Http\Requests\Expense\ExpenseDestroyProcessRequest;
use App\Http\Requests\Expense\ExpenseDestroyViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class ExpenseDestroyController
{
    public function view(ExpenseDestroyViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(ExpenseDestroyProcessRequest $request): Response
    {
        return $request->respond();
    }
}
