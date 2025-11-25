<?php

declare(strict_types=1);

namespace App\Http\Controllers\ExpenseItem;

use App\Http\Requests\ExpenseItem\ExpenseItemStoreProcessRequest;
use Symfony\Component\HttpFoundation\Response;

final class ExpenseItemStoreController
{
    public function process(ExpenseItemStoreProcessRequest $request): Response
    {
        return $request->respond();
    }
}
