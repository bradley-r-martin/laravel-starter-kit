<?php

declare(strict_types=1);

namespace App\Http\Controllers\Operator;

use App\Http\Requests\Operator\OperatorUnsuspendProcessRequest;
use App\Http\Requests\Operator\OperatorUnsuspendViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class OperatorUnsuspendController
{
    public function view(OperatorUnsuspendViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(OperatorUnsuspendProcessRequest $request): Response
    {
        return $request->respond();
    }
}
