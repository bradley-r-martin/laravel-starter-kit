<?php

declare(strict_types=1);

namespace App\Http\Controllers\User;

use App\Http\Requests\User\UserCreateProcessRequest;
use App\Http\Requests\User\UserCreateViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class UserCreateController
{
    public function view(UserCreateViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(UserCreateProcessRequest $request): Response
    {
        return $request->respond();
    }
}
