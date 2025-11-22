<?php

declare(strict_types=1);

namespace App\Http\Controllers\Expense;

use App\Http\Requests\Expense\ExpenseDetailViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class ExpenseDetailController
{
    public function view(ExpenseDetailViewRequest $request): Response
    {
        return $request->respond();
    }
}
