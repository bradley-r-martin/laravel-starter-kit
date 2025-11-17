<?php

declare(strict_types=1);

namespace App\Http\Controllers\Authentication;

use App\Http\Requests\Authentication\AuthenticationLogoutViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class AuthenticationLogoutController
{
    public function view(AuthenticationLogoutViewRequest $request): Response
    {
        return $request->respond();
    }
}
