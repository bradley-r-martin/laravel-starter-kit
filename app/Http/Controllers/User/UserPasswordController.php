<?php

declare(strict_types=1);

namespace App\Http\Controllers\User;

use App\Http\Requests\User\UserPasswordProcessRequest;
use App\Http\Requests\User\UserPasswordViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class UserPasswordController
{
    public function view(UserPasswordViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(UserPasswordProcessRequest $request): Response
    {
        return $request->respond();
    }
}
