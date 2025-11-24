<?php

declare(strict_types=1);

namespace App\Http\Controllers\ExpenseItem;

use App\Http\Requests\ExpenseItem\ExpenseItemDestroyProcessRequest;
use App\Http\Requests\ExpenseItem\ExpenseItemDestroyViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class ExpenseItemDestroyController
{
    public function view(ExpenseItemDestroyViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(ExpenseItemDestroyProcessRequest $request): Response
    {
        return $request->respond();
    }
}
