<?php

declare(strict_types=1);

namespace App\Http\Controllers\Expense;

use App\Http\Requests\Expense\ExpenseAnalyzeRequest;
use Symfony\Component\HttpFoundation\Response;

final class ExpenseAnalyzeController
{
    public function process(ExpenseAnalyzeRequest $request): Response
    {
        return $request->respond();
    }
}
