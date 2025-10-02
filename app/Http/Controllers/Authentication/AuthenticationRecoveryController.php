<?php

declare(strict_types=1);

namespace App\Http\Controllers\Authentication;

use App\Http\Requests\Authentication\AuthenticationRecoveryProcessRequest;
use App\Http\Requests\Authentication\AuthenticationRecoveryViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class AuthenticationRecoveryController
{
    public function view(AuthenticationRecoveryViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(AuthenticationRecoveryProcessRequest $request): Response
    {
        return $request->respond();
    }
}
