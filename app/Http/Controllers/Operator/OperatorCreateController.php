<?php

declare(strict_types=1);

namespace App\Http\Controllers\Operator;

use App\Http\Requests\Operator\OperatorCreateProcessRequest;
use App\Http\Requests\Operator\OperatorCreateViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class OperatorCreateController
{
    public function view(OperatorCreateViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(OperatorCreateProcessRequest $request): Response
    {
        return $request->respond();
    }
}
