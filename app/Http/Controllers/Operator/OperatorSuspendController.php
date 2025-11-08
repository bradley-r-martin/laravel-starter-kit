<?php

declare(strict_types=1);

namespace App\Http\Controllers\Operator;

use App\Http\Requests\Operator\OperatorSuspendProcessRequest;
use App\Http\Requests\Operator\OperatorSuspendViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class OperatorSuspendController
{
    public function view(OperatorSuspendViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(OperatorSuspendProcessRequest $request): Response
    {
        return $request->respond();
    }
}
