<?php

declare(strict_types=1);

namespace App\Http\Controllers\ExpenseItem;

use App\Http\Requests\ExpenseItem\ExpenseItemUpdateProcessRequest;
use Symfony\Component\HttpFoundation\Response;

final class ExpenseItemUpdateController
{
    public function process(ExpenseItemUpdateProcessRequest $request): Response
    {
        return $request->respond();
    }
}
