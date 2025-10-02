<?php

declare(strict_types=1);

namespace App\Http\Controllers\Authentication;

use App\Http\Requests\Authentication\AuthenticationResetProcessRequest;
use App\Http\Requests\Authentication\AuthenticationResetViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class AuthenticationResetController
{
    public function view(AuthenticationResetViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(AuthenticationResetProcessRequest $request): Response
    {
        return $request->respond();
    }
}
