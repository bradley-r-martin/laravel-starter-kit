<?php

declare(strict_types=1);

namespace App\Http\Controllers\Operator;

use App\Http\Requests\Operator\OperatorUpdateProcessRequest;
use App\Http\Requests\Operator\OperatorUpdateViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class OperatorUpdateController
{
    public function view(OperatorUpdateViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(OperatorUpdateProcessRequest $request): Response
    {
        return $request->respond();
    }
}
