<?php

declare(strict_types=1);

namespace App\Http\Controllers\Operator;

use App\Http\Requests\Operator\OperatorCloseProcessRequest;
use App\Http\Requests\Operator\OperatorCloseViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class OperatorCloseController
{
    public function view(OperatorCloseViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(OperatorCloseProcessRequest $request): Response
    {
        return $request->respond();
    }
}
