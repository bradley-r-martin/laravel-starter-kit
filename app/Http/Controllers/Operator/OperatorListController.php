<?php

declare(strict_types=1);

namespace App\Http\Controllers\Operator;

use App\Http\Requests\Operator\OperatorListViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class OperatorListController
{
    public function view(OperatorListViewRequest $request): Response
    {
        return $request->respond();
    }
}
