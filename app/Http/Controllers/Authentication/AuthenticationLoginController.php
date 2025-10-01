<?php

declare(strict_types=1);

namespace App\Http\Controllers\Authentication;

use App\Http\Requests\Authentication\AuthenticationLoginProcessRequest;
use App\Http\Requests\Authentication\AuthenticationLoginViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class AuthenticationLoginController
{
    public function view(AuthenticationLoginViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(AuthenticationLoginProcessRequest $request): Response
    {
        return $request->respond();
    }
}
