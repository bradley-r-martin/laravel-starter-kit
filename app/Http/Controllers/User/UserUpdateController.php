<?php

declare(strict_types=1);

namespace App\Http\Controllers\User;

use App\Http\Requests\User\UserUpdateProcessRequest;
use App\Http\Requests\User\UserUpdateViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class UserUpdateController
{
    public function view(UserUpdateViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(UserUpdateProcessRequest $request): Response
    {
        return $request->respond();
    }
}
