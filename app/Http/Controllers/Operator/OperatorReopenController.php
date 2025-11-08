<?php

declare(strict_types=1);

namespace App\Http\Controllers\Operator;

use App\Http\Requests\Operator\OperatorReopenProcessRequest;
use App\Http\Requests\Operator\OperatorReopenViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class OperatorReopenController
{
    public function view(OperatorReopenViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(OperatorReopenProcessRequest $request): Response
    {
        return $request->respond();
    }
}
