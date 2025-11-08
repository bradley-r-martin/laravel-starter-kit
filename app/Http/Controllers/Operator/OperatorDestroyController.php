<?php

declare(strict_types=1);

namespace App\Http\Controllers\Operator;

use App\Http\Requests\Operator\OperatorDestroyProcessRequest;
use App\Http\Requests\Operator\OperatorDestroyViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class OperatorDestroyController
{
    public function view(OperatorDestroyViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(OperatorDestroyProcessRequest $request): Response
    {
        return $request->respond();
    }
}
